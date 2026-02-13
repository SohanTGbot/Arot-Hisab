"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/lib/actions/audit';

/**
 * Check if the current user is an admin
 */
async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsers(page: number = 1, limit: number = 20, search: string = '') {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();
    const offset = (page - 1) * limit;

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        data: data,
        metadata: {
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
}

/**
 * Toggle user ban status (Admin only)
 */
export async function toggleUserBan(userId: string, shouldBan: boolean) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .update({ is_active: !shouldBan })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    await logAdminAction({
        action: shouldBan ? 'ban_user' : 'unban_user',
        resourceType: 'user',
        resourceId: userId,
        details: { is_active: !shouldBan }
    });

    revalidatePath('/admin/users');
    return { success: true, data };
}

/**
 * Get Dashboard Stats (Admin only)
 */
export async function getDashboardStats() {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Parallel fetch for stats
    const [
        { count: totalUsers },
        { count: totalTransactions },
        { data: recentTransactions },
        { data: dailyLimit } // Just to get a rough idea or sum
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('daily_summaries').select('total_final_amount').order('date', { ascending: false }).limit(30)
    ]);

    // Calculate total revenue from daily summaries (cached aggregation)
    // Ideally we should have a separate aggregation table or query, but for now summing daily summaries is efficient enough
    const totalRevenue = dailyLimit?.reduce((sum: number, day: any) => sum + (day.total_final_amount || 0), 0) || 0;

    return {
        success: true,
        data: {
            totalUsers: totalUsers || 0,
            totalTransactions: totalTransactions || 0,
            totalRevenue: totalRevenue,
            recentTransactions: recentTransactions || []
        }
    };
}

/**
 * Get Revenue Chart Data (Admin only)
 * Returns last 30 days revenue
 */
export async function getRevenueAnalytics() {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
        .from('daily_summaries')
        .select('date, total_final_amount, total_transactions')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

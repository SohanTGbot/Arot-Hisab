"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TablesInsert, TablesUpdate } from '@/types/supabase';
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
 * Get System Settings (Publicly available for maintenance mode check, but restricted fields for writes)
 */
export async function getSystemSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('settings')
        .select('*');

    if (error) {
        return { success: false, error: error.message };
    }

    // Convert array to object for easier access
    const settingsMap = data.reduce((acc: Record<string, any>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, any>);

    return { success: true, data: settingsMap };
}

/**
 * Update System Settings (Admin only)
 */
export async function updateSystemSetting(key: string, value: any, description?: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Upsert setting
    const { data, error } = await supabase
        .from('settings')
        .upsert({
            key,
            value,
            description,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'key'
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    await logAdminAction({
        action: 'update_setting',
        resourceType: 'settings',
        resourceId: key,
        details: { value, description }
    });

    revalidatePath('/admin/settings');
    revalidatePath('/'); // Revalidate globally in case of maintenance mode
    return { success: true, data };
}

/**
 * Get all Feedback (Admin only)
 */
export async function getAllFeedback(page: number = 1, limit: number = 20, status?: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();
    const offset = (page - 1) * limit;

    let query = supabase
        .from('feedback')
        .select('*, users(full_name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, count, error } = await query;

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        data,
        metadata: {
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
}

/**
 * Update Feedback Status (Admin only)
 */
export async function updateFeedbackStatus(id: string, status: string, adminNotes?: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const updates: any = { status };
    if (adminNotes !== undefined) {
        updates.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    await logAdminAction({
        action: 'update_feedback_status',
        resourceType: 'feedback',
        resourceId: id,
        details: { status, adminNotes }
    });

    revalidatePath('/admin/feedback');
    return { success: true, data };
}

/**
 * Create a new Feedback (User)
 */
export async function submitFeedback(data: { type: string; subject: string; description: string; priority: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data: feedback, error } = await supabase
        .from('feedback')
        .insert({
            ...data,
            user_id: user.id,
            status: 'open'
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data: feedback };
}

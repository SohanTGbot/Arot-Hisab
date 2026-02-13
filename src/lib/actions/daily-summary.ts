"use server";

import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

type DailySummary = Tables<'daily_summaries'>;

/**
 * Generate daily summary for a specific user and date
 */
export async function generateDailySummary(userId: string, date: Date) {
    const supabase = await createClient();

    // Get start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all transactions for the day
    const { data: transactions, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

    if (fetchError) {
        return { success: false, error: fetchError.message };
    }

    if (!transactions || transactions.length === 0) {
        // No transactions for this day, skip summary creation
        return { success: true, data: null, message: 'No transactions for this day' };
    }

    // Calculate totals
    const summary = transactions.reduce(
        (acc, t) => ({
            total_transactions: acc.total_transactions + 1,
            total_gross_weight: acc.total_gross_weight + t.gross_weight_kg,
            total_net_weight: acc.total_net_weight + t.net_weight_kg,
            total_base_amount: acc.total_base_amount + t.base_amount,
            total_commission: acc.total_commission + (t.final_amount - t.base_amount),
            total_final_amount: acc.total_final_amount + t.final_amount,
        }),
        {
            total_transactions: 0,
            total_gross_weight: 0,
            total_net_weight: 0,
            total_base_amount: 0,
            total_commission: 0,
            total_final_amount: 0,
        }
    );

    // Upsert daily summary
    const { data, error } = await supabase
        .from('daily_summaries')
        .upsert({
            user_id: userId,
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
            ...summary,
        }, {
            onConflict: 'user_id,date',
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Generate daily summaries for all active users for yesterday
 * This should be run as a cron job
 */
export async function generateAllUsersDailySummaries() {
    const supabase = await createClient();

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch all active users
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('is_active', true);

    if (usersError) {
        return { success: false, error: usersError.message };
    }

    if (!users || users.length === 0) {
        return { success: true, message: 'No active users found' };
    }

    const results = [];
    for (const user of users) {
        const result = await generateDailySummary(user.id, yesterday);
        results.push({ userId: user.id, result });
    }

    return { success: true, data: results };
}

/**
 * Get daily summaries for current user
 */
export async function getDailySummaries(startDate?: Date, endDate?: Date) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    let query = supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    if (startDate) {
        query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    if (endDate) {
        query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

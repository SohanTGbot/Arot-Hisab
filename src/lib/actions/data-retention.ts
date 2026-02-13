"use server";

import { createClient } from '@/lib/supabase/server';

/**
 * Delete soft-deleted transactions older than 90 days
 * This should be run as a cron job
 */
export async function cleanupDeletedTransactions() {
    const supabase = await createClient();

    // Calculate the cutoff date (90 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const { data, error } = await supabase
        .from('transactions')
        .delete()
        .eq('is_deleted', true)
        .lt('updated_at', cutoffDate.toISOString());

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, message: `Cleaned up deleted transactions older than 90 days` };
}

/**
 * Mark inactive user accounts
 * Users with no login for 180 days
 */
export async function markInactiveUsers() {
    const supabase = await createClient();

    // Calculate the cutoff date (180 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    const { data, error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('is_active', true)
        .lt('last_login', cutoffDate.toISOString());

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, message: 'Marked inactive users' };
}

/**
 * Delete inactive user accounts after 365 days of inactivity
 */
export async function deleteInactiveAccounts() {
    const supabase = await createClient();

    // Calculate the cutoff date (365 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);

    // Get users to delete
    const { data: usersToDelete, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('is_active', false)
        .lt('last_login', cutoffDate.toISOString());

    if (fetchError) {
        return { success: false, error: fetchError.message };
    }

    if (!usersToDelete || usersToDelete.length === 0) {
        return { success: true, message: 'No inactive accounts to delete' };
    }

    // Delete user data
    for (const user of usersToDelete) {
        // Delete transactions
        await supabase.from('transactions').delete().eq('user_id', user.id);

        // Delete contacts
        await supabase.from('saved_contacts').delete().eq('user_id', user.id);

        // Delete daily summaries
        await supabase.from('daily_summaries').delete().eq('user_id', user.id);

        // Delete donations
        await supabase.from('donations').delete().eq('user_id', user.id);

        // Delete feedback
        await supabase.from('feedback').delete().eq('user_id', user.id);

        // Delete user profile
        await supabase.from('users').delete().eq('id', user.id);
    }

    return {
        success: true,
        message: `Deleted ${usersToDelete.length} inactive accounts`
    };
}

/**
 * Run all data retention policies
 */
export async function runDataRetentionPolicies() {
    const results = {
        cleanupTransactions: await cleanupDeletedTransactions(),
        markInactive: await markInactiveUsers(),
        deleteAccounts: await deleteInactiveAccounts(),
    };

    return { success: true, data: results };
}

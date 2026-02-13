"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TablesUpdate } from '@/types/supabase';

/**
 * Get current user profile
 */
export async function getUserProfile() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: TablesUpdate<'users'>) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Don't allow changing role or id
    const { role, id, ...safeUpdates } = updates as any;

    const { data, error } = await supabase
        .from('users')
        .update(safeUpdates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    // Update last_login
    await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

    revalidatePath('/dashboard');
    revalidatePath('/settings');

    return { success: true, data };
}

/**
 * Deactivate user account (soft delete)
 */
export async function deactivateAccount() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { success: true };
}

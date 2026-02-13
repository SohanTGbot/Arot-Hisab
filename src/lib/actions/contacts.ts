"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

type SavedContact = Tables<'saved_contacts'>;
type SavedContactInsert = TablesInsert<'saved_contacts'>;
type SavedContactUpdate = TablesUpdate<'saved_contacts'>;

/**
 * Get all saved contacts for current user
 */
export async function getSavedContacts(type?: 'seller' | 'buyer') {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    let query = supabase
        .from('saved_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

    if (type) {
        query = query.eq('contact_type', type);
    }

    const { data, error } = await query;

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Create a new saved contact
 */
export async function createSavedContact(data: Omit<SavedContactInsert, 'id' | 'created_at' | 'user_id'>) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data: contact, error } = await supabase
        .from('saved_contacts')
        .insert({
            ...data,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: contact };
}

/**
 * Update a saved contact
 */
export async function updateSavedContact(id: string, updates: SavedContactUpdate) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('saved_contacts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data };
}

/**
 * Delete a saved contact
 */
export async function deleteSavedContact(id: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('saved_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

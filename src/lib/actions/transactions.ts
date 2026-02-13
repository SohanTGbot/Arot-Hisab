"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { calculateTransaction } from '@/lib/calculations';

type Transaction = Tables<'transactions'>;
type TransactionInsert = TablesInsert<'transactions'>;
type TransactionUpdate = TablesUpdate<'transactions'>;

/**
 * Create a new transaction
 */
export async function createTransaction(data: Omit<TransactionInsert, 'id' | 'created_at' | 'updated_at' | 'net_weight_kg' | 'base_amount' | 'final_amount'> & { deduction_percent?: number }) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Calculate the transaction values
    const calculation = calculateTransaction({
        grossWeightKg: data.gross_weight_kg,
        ratePerKg: data.rate_per_kg,
        deductionMethod: data.deduction_method as 'A' | 'B',
        deductionPercent: data.deduction_percent,
        commissionPercent: data.commission_percent,
    });

    // Insert transaction
    const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
            ...data,
            user_id: user.id,
            net_weight_kg: calculation.netWeightKg,
            base_amount: calculation.baseAmount,
            final_amount: calculation.finalAmount,
        } as any) // Cast to any to avoid strict type checks on extended props
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: transaction };
}

/**
 * Get all transactions for current user
 */
export async function getTransactions(includeDeleted: boolean = false) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!includeDeleted) {
        query = query.eq('is_deleted', false);
    }

    const { data, error } = await query;

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(id: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Update a transaction
 */
export async function updateTransaction(id: string, updates: TransactionUpdate & { deduction_percent?: number }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    // If weight, rate, or deduction method changed, recalculate
    if (updates.gross_weight_kg !== undefined || updates.rate_per_kg !== undefined || updates.deduction_method !== undefined || updates.deduction_percent !== undefined) {
        // Get existing transaction to get missing values
        const { data: existing } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (existing) {
            const calculation = calculateTransaction({
                grossWeightKg: updates.gross_weight_kg ?? existing.gross_weight_kg,
                ratePerKg: updates.rate_per_kg ?? existing.rate_per_kg,
                deductionMethod: (updates.deduction_method ?? existing.deduction_method) as 'A' | 'B',
                deductionPercent: updates.deduction_percent ?? 5, // Default if not provided
                commissionPercent: updates.commission_percent ?? existing.commission_percent,
            });

            updates.net_weight_kg = calculation.netWeightKg;
            updates.base_amount = calculation.baseAmount;
            updates.final_amount = calculation.finalAmount;
        }
    }

    // Remove deduction_percent from updates before sending to DB
    const { deduction_percent, ...dbUpdates } = updates;

    const { data, error } = await supabase
        .from('transactions')
        .update(dbUpdates)
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
 * Soft delete a transaction
 */
export async function deleteTransaction(id: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('transactions')
        .update({ is_deleted: true })
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
 * Restore a soft-deleted transaction
 */
export async function restoreTransaction(id: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('transactions')
        .update({ is_deleted: false })
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
 * Get transactions by date range
 */
export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

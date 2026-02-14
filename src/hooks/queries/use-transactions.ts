"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    getTransactionsByDateRange,
} from '@/lib/actions/transactions';
import type { TablesInsert, TablesUpdate } from '@/types/supabase';

/**
 * Hook to fetch all transactions
 */
export function useTransactions(includeDeleted: boolean = false) {
    return useQuery({
        queryKey: ['transactions', includeDeleted],
        queryFn: async () => {
            const result = await getTransactions(includeDeleted);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });
}

/**
 * Hook to fetch a single transaction
 */
export function useTransaction(id: string) {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: async () => {
            const result = await getTransactionById(id);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: !!id,
    });
}

/**
 * Hook to fetch transactions by date range
 */
export function useTransactionsByDateRange(startDate: Date, endDate: Date, enabled: boolean = true) {
    return useQuery({
        queryKey: ['transactions', 'date-range', startDate.toISOString(), endDate.toISOString()],
        queryFn: async () => {
            const result = await getTransactionsByDateRange(startDate, endDate);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled,
    });
}

/**
 * Hook to create a transaction
 */
export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<TablesInsert<'transactions'>, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
            const result = await createTransaction(data);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}

/**
 * Hook to update a transaction
 */
export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'transactions'> }) => {
            const result = await updateTransaction(id, updates);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
        },
    });
}

/**
 * Hook to delete a transaction (soft delete)
 */
export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteTransaction(id);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}

/**
 * Hook to restore a deleted transaction
 */
export function useRestoreTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await restoreTransaction(id);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}

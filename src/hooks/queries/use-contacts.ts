"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSavedContacts,
    createSavedContact,
    updateSavedContact,
    deleteSavedContact,
} from '@/lib/actions/contacts';
import type { TablesInsert, TablesUpdate } from '@/types/supabase';

/**
 * Hook to fetch saved contacts
 */
export function useSavedContacts(type?: 'seller' | 'buyer') {
    return useQuery({
        queryKey: ['saved-contacts', type],
        queryFn: async () => {
            const result = await getSavedContacts(type);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });
}

/**
 * Hook to create a saved contact
 */
export function useCreateSavedContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<TablesInsert<'saved_contacts'>, 'id' | 'created_at' | 'user_id'>) => {
            const result = await createSavedContact(data);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-contacts'] });
        },
    });
}

/**
 * Hook to update a saved contact
 */
export function useUpdateSavedContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'saved_contacts'> }) => {
            const result = await updateSavedContact(id, updates);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-contacts'] });
        },
    });
}

/**
 * Hook to delete a saved contact
 */
export function useDeleteSavedContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteSavedContact(id);
            if (!result.success) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-contacts'] });
        },
    });
}

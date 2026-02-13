"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Log a new donation (Admin or User)
 */
export async function logDonation(data: {
    donor_name?: string;
    amount: number;
    payment_method: string; // 'bkash', 'nagad', 'bank', 'cash'
    transaction_id?: string;
    message?: string;
    is_anonymous?: boolean;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: donation, error } = await supabase
        .from('donations')
        .insert({
            ...data,
            user_id: user?.id || null, // Can be null for anonymous public donations if we allow it, but schema might require it?
            // Checking schema: user_id is uuid references public.users(id). If it's nullable, we can have anonymous.
            // If schema enforces not null, we might need a system user or only logged in users.
            // Let's assume for now strictly logged in or check schema.
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/donations');
    revalidatePath('/admin/donations');
    return { success: true, data: donation };
}

/**
 * Get public donation history (Transparency)
 */
export async function getPublicDonations(page: number = 1, limit: number = 10) {
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
        .from('donations')
        .select('id, donor_name, amount, created_at, message, is_anonymous', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        return { success: false, error: error.message };
    }

    // Hide names if anonymous
    const maskedData = data?.map(d => ({
        ...d,
        donor_name: d.is_anonymous ? 'Anonymous' : d.donor_name
    }));

    return {
        success: true,
        data: maskedData,
        metadata: {
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
}

/**
 * Get all donations (Admin)
 */
export async function getAdminDonations(page: number = 1, limit: number = 20) {
    const supabase = await createClient();
    // Admin check should be done via middleware or RLS, but double check here if needed
    // relying on RLS is safer if we trust the policy "Admins can view all"

    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

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

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Simple validation since donation schema might not be in forms.ts
interface DonationData {
    amount: number;
    paymentMethod: string;
    message?: string;
    isAnonymous?: boolean; // Typically handled by UI logic or stored in message
    donorName?: string;
}

export async function processDonation(data: DonationData) {
    try {
        const supabase = await createClient();

        // Check if user is logged in (optional for donations, but good to link if they are)
        const { data: { user } } = await supabase.auth.getUser();

        // Basic validation
        if (!data.amount || data.amount <= 0) {
            return { error: 'Invalid donation amount' };
        }

        const { error } = await supabase
            .from('donations')
            .insert({
                user_id: user?.id || null, // Allow anonymous/guest donations if table allows null user_id
                amount: data.amount,
                payment_method: data.paymentMethod,
                message: data.message,
                status: 'pending', // Pending real payment integration
                // Store donor name in message or separate metadata if schema allows
            });

        if (error) {
            console.error('Error processing donation:', error);
            return { error: 'Failed to process donation record.' };
        }

        revalidatePath('/dashboard/donations');
        return { success: true };
    } catch (error) {
        console.error('Unexpected error in processDonation:', error);
        return { error: 'An unexpected error occurred.' };
    }
}

"use server";

import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

/**
 * Submit Contact Form
 */
export async function submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const headerStore = await headers();
    const ip = headerStore.get('x-forwarded-for') || 'unknown';

    // Stricter rate limit for public form
    const isAllowed = await rateLimit(ip + '_contact');
    if (!isAllowed) {
        return { success: false, error: 'Too many requests. Please try again later.' };
    }

    const supabase = await createClient();

    // Use service role if RLS prevents anonymous inserts (though we added public policy)
    // Standard client should work if policy is correct.

    const { error } = await supabase
        .from('contact_messages')
        .insert({
            ...data,
            ip_address: ip,
        });

    if (error) {
        console.error('Contact form error:', error);
        return { success: false, error: 'Failed to submit message. Please try again.' };
    }

    return { success: true, message: 'Message sent successfully!' };
}

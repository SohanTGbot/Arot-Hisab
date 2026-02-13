'use server';

import { createClient } from '@/lib/supabase/server';
import { contactMessageSchema, type ContactMessageFormData } from '@/lib/validations/forms';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(data: ContactMessageFormData) {
    try {
        const supabase = await createClient();

        // Validate data formatting (double check server side)
        const validation = contactMessageSchema.safeParse(data);
        if (!validation.success) {
            return { error: 'Invalid form data' };
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: 'new',
                // ip_address can be added if we extract it from headers in a real deployment
            });

        if (error) {
            console.error('Error submitting contact form:', error);
            return { error: 'Failed to submit message. Please try again.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Unexpected error in submitContactForm:', error);
        return { error: 'An unexpected error occurred.' };
    }
}

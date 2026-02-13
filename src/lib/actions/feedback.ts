'use server';

import { createClient } from '@/lib/supabase/server';
import { feedbackSchema, type FeedbackFormData } from '@/lib/validations/forms';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(data: FeedbackFormData) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'You must be logged in to submit feedback.' };
        }

        // Validate data
        const validation = feedbackSchema.safeParse(data);
        if (!validation.success) {
            return { error: 'Invalid form data' };
        }

        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: user.id,
                type: data.type,
                priority: data.priority,
                subject: data.subject,
                description: data.description,
                status: 'open',
            });

        if (error) {
            console.error('Error submitting feedback:', error);
            return { error: 'Failed to submit feedback. Please try again.' };
        }

        revalidatePath('/admin/feedback'); // Revalidate admin feedback list if it exists
        return { success: true };
    } catch (error) {
        console.error('Unexpected error in submitFeedback:', error);
        return { error: 'An unexpected error occurred.' };
    }
}

"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(data: {
    fullName: string;
    email: string;
    password: string;
}) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Create user profile in users table
    if (authData.user) {
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: authData.user.email!,
                full_name: data.fullName,
            });

        if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't fail the signup, profile can be created later
        }
    }

    revalidatePath('/', 'layout');
    return {
        success: true,
        data: authData,
        message: 'Account created! Please check your email to verify your account.',
    };
}

/**
 * Sign in a user with email and password
 */
export async function signInWithEmail(data: {
    email: string;
    password: string;
}) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Check if email is verified
    if (authData.user && !authData.user.email_confirmed_at) {
        return {
            success: false,
            error: 'Please verify your email before signing in.',
            needsVerification: true,
        };
    }

    revalidatePath('/', 'layout');
    return { success: true, data: authData };
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.',
    };
}

/**
 * Reset password with new password (requires active session from reset link)
 */
export async function resetPassword(password: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Invalid or expired reset link.' };
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return {
        success: true,
        message: 'Password updated successfully! You can now sign in with your new password.',
    };
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated.' };
    }

    if (user.email_confirmed_at) {
        return { success: false, error: 'Email is already verified.' };
    }

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        message: 'Verification email sent! Please check your inbox.',
    };
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

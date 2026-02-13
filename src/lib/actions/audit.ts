"use server";

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

interface AuditLogEntry {
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: any;
}

/**
 * Log an admin action
 */
export async function logAdminAction(entry: AuditLogEntry) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return; // Should allow system logs? For now only auth users.

        const headerStore = await headers();
        const ip = headerStore.get('x-forwarded-for') || 'unknown';
        const userAgent = headerStore.get('user-agent') || 'unknown';

        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: entry.action,
            resource_type: entry.resourceType,
            resource_id: entry.resourceId,
            details: entry.details,
            ip_address: ip,
            user_agent: userAgent,
        });
    } catch (error) {
        console.error('Failed to log admin action:', error);
        // Silent fail to not block main action
    }
}

/**
 * Get Audit Logs (Admin only)
 */
export async function getAuditLogs(page: number = 1, limit: number = 20) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Check admin role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
        .from('audit_logs')
        .select('*, users(full_name, email)', { count: 'exact' })
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

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllUsers,
    toggleUserBan,
    getDashboardStats,
    getRevenueAnalytics
} from '@/lib/actions/admin';
import {
    getAllFeedback,
    updateFeedbackStatus,
    getSystemSettings,
    updateSystemSetting
} from '@/lib/actions/content';
import { getAuditLogs } from '@/lib/actions/audit';

/**
 * Hook for fetching users
 */
export function useAdminUsers(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ['admin-users', page, limit, search],
        queryFn: async () => {
            const result = await getAllUsers(page, limit, search);
            if (!result.success) throw new Error(result.error);
            return result;
        }
    });
}

/**
 * Hook for modifying user ban status
 */
export function useAdminUserBan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, shouldBan }: { userId: string; shouldBan: boolean }) => {
            const result = await toggleUserBan(userId, shouldBan);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    });
}

/**
 * Hook for dashboard stats
 */
export function useAdminStats() {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const result = await getDashboardStats();
            if (!result.success) throw new Error(result.error);
            return result.data;
        }
    });
}

/**
 * Hook for analytics charts
 */
export function useAdminAnalytics() {
    return useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const result = await getRevenueAnalytics();
            if (!result.success) throw new Error(result.error);
            return result.data;
        }
    });
}

/**
 * Hook for Feedback management
 */
export function useAdminFeedback(page: number, limit: number, status?: string) {
    return useQuery({
        queryKey: ['admin-feedback', page, limit, status],
        queryFn: async () => {
            const result = await getAllFeedback(page, limit, status);
            if (!result.success) throw new Error(result.error);
            return result;
        }
    });
}

/**
 * Hook to update feedback status
 */
export function useUpdateFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
            const result = await updateFeedbackStatus(id, status, notes);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
        }
    });
}

/**
 * Hook for System Settings
 */
export function useSystemSettings() {
    return useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const result = await getSystemSettings();
            if (!result.success) throw new Error(result.error);
            return result.data;
        }
    });
}

/**
 * Hook to update settings
 */
export function useUpdateSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ key, value }: { key: string; value: any }) => {
            const result = await updateSystemSetting(key, value);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-settings'] });
        }
    });
}

/**
 * Hook for fetching audit logs
 */
export function useAuditLogs(page: number, limit: number) {
    return useQuery({
        queryKey: ['admin-audit-logs', page, limit],
        queryFn: async () => {
            const result = await getAuditLogs(page, limit);
            if (!result.success) throw new Error(result.error);
            return result;
        }
    });
}

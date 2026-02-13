import { Tables } from '@/types/supabase';

type Transaction = Tables<'transactions'>;

const STORAGE_KEY = 'arothisab_offline_transactions';
const SYNC_QUEUE_KEY = 'arothisab_sync_queue';

/**
 * Save transactions to local storage for offline access
 */
export function saveTransactionsOffline(transactions: Transaction[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Failed to save transactions offline:', error);
    }
}

/**
 * Load transactions from local storage
 */
export function loadTransactionsOffline(): Transaction[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load offline transactions:', error);
        return [];
    }
}

/**
 * Add transaction to sync queue
 */
export function addToSyncQueue(transaction: Partial<Transaction>): void {
    try {
        const queue = getSyncQueue();
        queue.push({
            ...transaction,
            _timestamp: Date.now(),
            _synced: false,
        });
        localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
        console.error('Failed to add to sync queue:', error);
    }
}

/**
 * Get pending sync queue
 */
export function getSyncQueue(): any[] {
    try {
        const stored = localStorage.getItem(SYNC_QUEUE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to get sync queue:', error);
        return [];
    }
}

/**
 * Clear sync queue after successful sync
 */
export function clearSyncQueue(): void {
    try {
        localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
    } catch (error) {
        console.error('Failed to clear sync queue:', error);
    }
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Clear all offline data
 */
export function clearOfflineData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (error) {
        console.error('Failed to clear offline data:', error);
    }
}

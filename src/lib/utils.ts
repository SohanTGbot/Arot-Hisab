import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toBengaliNumber } from "@/lib/i18n/bengali-numbers";

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency in INR (Indian Rupee)
 */
export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format weight in kg
 */
export function formatWeight(weight: number): string {
    return `${weight.toFixed(3)} kg`;
}

/**
 * Format date
 */
export function formatDate(date: Date | string, locale: string = 'en-IN'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string, locale: string = 'en-IN'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format distance to now (e.g., "2 minutes ago", "3 hours ago")
 */
/**
 * Format distance to now (e.g., "2 minutes ago", "3 hours ago")
 */
export function formatDistanceToNow(date: Date | string, locale: string = 'en'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInSeconds = Math.max(0, Math.floor(diffInMs / 1000));
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const isBn = locale === 'bn';
    const formatNum = (n: number) => isBn ? toBengaliNumber(n) : n;

    if (diffInSeconds < 60) {
        return isBn ? 'এইমাত্র' : 'just now';
    } else if (diffInMinutes < 60) {
        const val = formatNum(diffInMinutes);
        const unit = isBn ? 'মিনিট' : (diffInMinutes > 1 ? 'minutes' : 'minute');
        return isBn ? `${val} ${unit} আগে` : `${val} ${unit} ago`;
    } else if (diffInHours < 24) {
        const val = formatNum(diffInHours);
        const unit = isBn ? 'ঘণ্টা' : (diffInHours > 1 ? 'hours' : 'hour');
        return isBn ? `${val} ${unit} আগে` : `${val} ${unit} ago`;
    } else if (diffInDays < 7) {
        const val = formatNum(diffInDays);
        const unit = isBn ? 'দিন' : (diffInDays > 1 ? 'days' : 'day');
        return isBn ? `${val} ${unit} আগে` : `${val} ${unit} ago`;
    } else {
        return formatDate(d, isBn ? 'bn-BD' : 'en-IN');
    }
}

/**
 * Bengali Number System Utilities
 * Converts between English (0-9) and Bengali (০-৯) numerals
 */

// Bengali digit mapping
const bengaliDigits: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
};

const englishDigits: { [key: string]: string } = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
};

/**
 * Convert English numerals to Bengali numerals
 * @param value - Number or string containing English digits
 * @returns String with Bengali numerals
 */
export function toBengaliNumber(value: number | string): string {
    const str = String(value);
    return str.replace(/[0-9]/g, (digit) => bengaliDigits[digit] || digit);
}

/**
 * Convert Bengali numerals to English numerals
 * @param value - String containing Bengali digits
 * @returns String with English numerals
 */
export function toEnglishNumber(value: string): string {
    return value.replace(/[০-৯]/g, (digit) => englishDigits[digit] || digit);
}

/**
 * Format number based on locale preference
 * @param value - Number to format
 * @param useBengaliNumerals - Whether to use Bengali numerals
 * @returns Formatted number string
 */
export function formatNumber(
    value: number | string,
    useBengaliNumerals: boolean = false
): string {
    const numStr = String(value);

    if (useBengaliNumerals) {
        return toBengaliNumber(numStr);
    }

    return numStr;
}

/**
 * Format currency with proper locale
 * @param value - Amount to format
 * @param useBengaliNumerals - Whether to use Bengali numerals
 * @returns Formatted currency string
 */
export function formatCurrencyWithLocale(
    value: number,
    useBengaliNumerals: boolean = false
): string {
    // Format with Indian numbering system (lakhs, crores)
    const formatted = value.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });

    if (useBengaliNumerals) {
        return `₹${toBengaliNumber(formatted)}`;
    }

    return `₹${formatted}`;
}

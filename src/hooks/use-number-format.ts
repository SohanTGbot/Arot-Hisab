/**
 * Custom hook for formatting numbers with Bengali numeral support
 * Automatically uses the user's numeral preference from i18n context
 */

import { useI18n } from '@/lib/i18n/provider';
import { formatNumber, formatCurrencyWithLocale, toBengaliNumber, toEnglishNumber } from '@/lib/i18n/bengali-numbers';

export function useNumberFormat() {
    const { useBengaliNumerals, language } = useI18n();

    // Context-aware check: Use Bengali numerals if manually enabled OR if language is Bengali
    const shouldLocalize = useBengaliNumerals || language === 'bn';

    /**
     * Format a number according to user's numeral preference
     * @param value - Number or string to format
     * @returns Formatted number string
     */
    const format = (value: number | string): string => {
        return formatNumber(value, shouldLocalize);
    };

    /**
     * Format currency with proper locale and numeral system
     * @param value - Amount to format
     * @returns Formatted currency string
     */
    const formatCurrency = (value: number): string => {
        return formatCurrencyWithLocale(value, shouldLocalize);
    };

    return {
        format,
        formatCurrency,
        toBengali: toBengaliNumber,
        toEnglish: toEnglishNumber,
        useBengaliNumerals,
    };
}

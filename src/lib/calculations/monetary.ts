/**
 * Calculate base amount
 * Formula: Base Amount = Net Weight × Rate per kg
 */
export function calculateBaseAmount(
    netWeightKg: number,
    ratePerKg: number
): number {
    const baseAmount = netWeightKg * ratePerKg;
    return parseFloat(baseAmount.toFixed(2));
}

/**
 * Calculate commission amount
 * Formula: Commission = Base Amount × (Commission Percent / 100)
 */
export function calculateCommission(
    baseAmount: number,
    commissionPercent: number = 2.00
): number {
    const commission = baseAmount * (commissionPercent / 100);
    return parseFloat(commission.toFixed(2));
}

/**
 * Calculate final amount with commission
 * Formula: Final Amount = Base Amount × (1 + Commission Percent / 100)
 * Or: Final Amount = Base Amount + Commission Amount
 */
export function calculateFinalAmount(
    baseAmount: number,
    commissionPercent: number = 2.00
): number {
    const multiplier = 1 + (commissionPercent / 100);
    const finalAmount = baseAmount * multiplier;
    return parseFloat(finalAmount.toFixed(2));
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyStr: string): number {
    // Remove currency symbol and commas
    const cleaned = currencyStr.replace(/[₹,]/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parseFloat(parsed.toFixed(2));
}

/**
 * Format number as currency (INR)
 */
export function formatCurrency(amount: number, includeCurrencySymbol: boolean = true): string {
    const formatted = amount.toFixed(2);
    if (includeCurrencySymbol) {
        return `₹${formatted}`;
    }
    return formatted;
}

/**
 * Format number with Indian number system (lakhs, crores)
 */
export function formatIndianCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return formatted;
}

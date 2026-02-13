import type { DeductionMethod } from '@/types/transaction';

/**
 * Calculate net weight using Method A (Total Weight Deduction)
 * Formula: Net Weight = Gross Weight × 0.95
 * 
 * Example: 15.700 kg → 14.915 kg
 */
export function calculateNetWeightMethodA(grossWeightKg: number, deductionPercent: number = 5): number {
    const netWeight = grossWeightKg * (1 - deductionPercent / 100);
    return parseFloat(netWeight.toFixed(3));
}

/**
 * Calculate net weight using Method B (Kg Only Deduction)
 * Formula: Net Weight = (kg × 0.95) + grams
 * 
 * Example: 15.700 kg (15 kg + 700g) → (15 × 0.95) + 0.700 = 14.950 kg
 */
export function calculateNetWeightMethodB(grossWeightKg: number, deductionPercent: number = 5): number {
    const kgPart = Math.floor(grossWeightKg);
    const gramsPart = grossWeightKg - kgPart;

    const deductedKg = kgPart * (1 - deductionPercent / 100);
    const netWeight = deductedKg + gramsPart;

    return parseFloat(netWeight.toFixed(3));
}

/**
 * Calculate net weight based on the selected deduction method
 */
export function calculateNetWeight(
    grossWeightKg: number,
    method: DeductionMethod,
    deductionPercent: number = 5
): number {
    if (method === 'A') {
        return calculateNetWeightMethodA(grossWeightKg, deductionPercent);
    }
    return calculateNetWeightMethodB(grossWeightKg, deductionPercent);
}

/**
 * Parse weight string in format "XX.XXX" to number
 */
export function parseWeight(weightStr: string): number {
    const parsed = parseFloat(weightStr);
    return isNaN(parsed) ? 0 : parseFloat(parsed.toFixed(3));
}

/**
 * Format weight to 3 decimal places
 */
export function formatWeight(weight: number): string {
    return weight.toFixed(3);
}

/**
 * Convert kg and grams to total kg
 */
export function kgAndGramsToKg(kg: number, grams: number): number {
    const totalKg = kg + (grams / 1000);
    return parseFloat(totalKg.toFixed(3));
}

/**
 * Convert kg to separate kg and grams
 */
export function kgToKgAndGrams(totalKg: number): { kg: number; grams: number } {
    const kg = Math.floor(totalKg);
    const gramsDecimal = totalKg - kg;
    const grams = Math.round(gramsDecimal * 1000);

    return { kg, grams };
}

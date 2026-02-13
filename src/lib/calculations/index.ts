import type { CalculationInput, CalculationResult } from '@/types/transaction';
import { calculateNetWeight } from './weight';
import { calculateBaseAmount, calculateCommission, calculateFinalAmount } from './monetary';

/**
 * Main calculation function that performs all steps
 * 
 * @param input - Calculation input parameters
 * @returns Complete calculation result with all derived values
 */
export function calculateTransaction(input: CalculationInput): CalculationResult {
    const {
        grossWeightKg,
        ratePerKg,
        deductionMethod,
        deductionPercent = 5.00,
        commissionPercent = 2.00,
    } = input;

    // Step 1: Calculate net weight based on deduction method
    const netWeightKg = calculateNetWeight(grossWeightKg, deductionMethod, deductionPercent);

    // Step 2: Calculate base amount
    const baseAmount = calculateBaseAmount(netWeightKg, ratePerKg);

    // Step 3: Calculate commission
    const commissionAmount = calculateCommission(baseAmount, commissionPercent);

    // Step 4: Calculate final amount
    const finalAmount = calculateFinalAmount(baseAmount, commissionPercent);

    return {
        grossWeightKg,
        netWeightKg,
        ratePerKg,
        baseAmount,
        commissionPercent,
        commissionAmount,
        finalAmount,
        deductionMethod,
    };
}

// Re-export utility functions
export * from './weight';
export * from './monetary';

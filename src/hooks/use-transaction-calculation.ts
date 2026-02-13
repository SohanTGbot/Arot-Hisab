import { useState, useEffect, useMemo } from 'react';
import type { CalculationInput, CalculationResult, DeductionMethod } from '@/types/transaction';
import { calculateTransaction } from '@/lib/calculations';

interface UseTransactionCalculationProps {
    grossWeightKg: number;
    ratePerKg: number;
    deductionMethod: DeductionMethod;
    commissionPercent?: number;
}

/**
 * Hook for real-time transaction calculations
 * Automatically recalculates when inputs change
 */
export function useTransactionCalculation({
    grossWeightKg,
    ratePerKg,
    deductionMethod,
    commissionPercent = 2.00,
}: UseTransactionCalculationProps) {
    const [result, setResult] = useState<CalculationResult | null>(null);

    // Memoize the calculation to avoid unnecessary recalculations
    const calculatedResult = useMemo(() => {
        // Validate inputs
        if (grossWeightKg <= 0 || ratePerKg <= 0) {
            return null;
        }

        const input: CalculationInput = {
            grossWeightKg,
            ratePerKg,
            deductionMethod,
            commissionPercent,
        };

        return calculateTransaction(input);
    }, [grossWeightKg, ratePerKg, deductionMethod, commissionPercent]);

    useEffect(() => {
        setResult(calculatedResult);
    }, [calculatedResult]);

    return {
        result,
        isValid: result !== null,
    };
}

/**
 * Hook for comparing Method A vs Method B calculations
 */
export function useMethodComparison(grossWeightKg: number, ratePerKg: number) {
    const methodA = useTransactionCalculation({
        grossWeightKg,
        ratePerKg,
        deductionMethod: 'A',
    });

    const methodB = useTransactionCalculation({
        grossWeightKg,
        ratePerKg,
        deductionMethod: 'B',
    });

    const difference = useMemo(() => {
        if (!methodA.result || !methodB.result) return null;

        return {
            netWeightDiff: methodB.result.netWeightKg - methodA.result.netWeightKg,
            finalAmountDiff: methodB.result.finalAmount - methodA.result.finalAmount,
        };
    }, [methodA.result, methodB.result]);

    return {
        methodA,
        methodB,
        difference,
    };
}

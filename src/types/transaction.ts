export type DeductionMethod = 'A' | 'B';

export interface WeightInput {
    kg: number;
    grams: number;
}

export interface CalculationInput {
    grossWeightKg: number;
    ratePerKg: number;
    deductionMethod: DeductionMethod;
    deductionPercent?: number; // Default 5%
    commissionPercent?: number; // Default 2%
}

export interface CalculationResult {
    grossWeightKg: number;
    netWeightKg: number;
    ratePerKg: number;
    baseAmount: number;
    commissionPercent: number;
    commissionAmount: number;
    finalAmount: number;
    deductionMethod: DeductionMethod;
}

export interface TransactionFormData {
    sellerName?: string;
    grossWeightKg: number;
    ratePerKg: number;
    buyerName?: string;
    buyerAddress?: string;
    notes?: string;
}

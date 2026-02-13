/**
 * Test file for calculation functions
 * 
 * Run with: npm test (after setting up test framework)
 * 
 * These tests validate the calculation logic against the PRD examples
 */

import { calculateNetWeightMethodA, calculateNetWeightMethodB } from '../weight';
import { calculateBaseAmount, calculateFinalAmount } from '../monetary';
import { calculateTransaction } from '../index';

describe('Weight Calculations', () => {
    describe('Method A (Total Weight Deduction)', () => {
        it('should calculate net weight correctly for 15.700 kg', () => {
            const result = calculateNetWeightMethodA(15.700);
            expect(result).toBe(14.915);
        });

        it('should calculate net weight correctly for 13.500 kg', () => {
            const result = calculateNetWeightMethodA(13.500);
            expect(result).toBe(12.825);
        });
    });

    describe('Method B (Kg Only Deduction)', () => {
        it('should calculate net weight correctly for 15.700 kg', () => {
            const result = calculateNetWeightMethodB(15.700);
            expect(result).toBe(14.950);
        });

        it('should calculate net weight correctly for 13.500 kg', () => {
            const result = calculateNetWeightMethodB(13.500);
            expect(result).toBe(12.750);
        });
    });
});

describe('Monetary Calculations', () => {
    it('should calculate base amount correctly', () => {
        const result = calculateBaseAmount(12.85, 110);
        expect(result).toBe(1413.50);
    });

    it('should calculate final amount with 2% commission', () => {
        const result = calculateFinalAmount(1413.50, 2.00);
        expect(result).toBe(1441.77);
    });

    it('should calculate final amount with 1.5% commission', () => {
        const result = calculateFinalAmount(1000, 1.5);
        expect(result).toBe(1015.00);
    });
});

describe('Full Transaction Calculation', () => {
    it('should calculate complete transaction using Method A (PRD Example)', () => {
        const result = calculateTransaction({
            grossWeightKg: 15.700,
            ratePerKg: 120,
            deductionMethod: 'A',
            commissionPercent: 2.00,
        });

        expect(result.netWeightKg).toBe(14.915);
        expect(result.baseAmount).toBe(1789.80);
        expect(result.finalAmount).toBe(1825.60);
    });

    it('should calculate complete transaction using Method B (PRD Example)', () => {
        const result = calculateTransaction({
            grossWeightKg: 15.700,
            ratePerKg: 120,
            deductionMethod: 'B',
            commissionPercent: 2.00,
        });

        expect(result.netWeightKg).toBe(14.950);
        expect(result.baseAmount).toBe(1794.00);
        expect(result.finalAmount).toBe(1829.88);
    });

    it('should show difference between Method A and B', () => {
        const methodA = calculateTransaction({
            grossWeightKg: 15.700,
            ratePerKg: 120,
            deductionMethod: 'A',
        });

        const methodB = calculateTransaction({
            grossWeightKg: 15.700,
            ratePerKg: 120,
            deductionMethod: 'B',
        });

        const amountDifference = methodB.finalAmount - methodA.finalAmount;
        expect(amountDifference).toBe(4.28);
    });
});

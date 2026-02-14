
import { calculateNetWeightMethodB } from './src/lib/calculations/weight';

const grossWeight = 15.700;
const deductionResult = calculateNetWeightMethodB(grossWeight, 5);

console.log(`Gross Weight: ${grossWeight}`);
console.log(`Method B Result: ${deductionResult}`);

const expected = 14.950; // (15 * 0.95) + 0.700 = 14.25 + 0.7 = 14.95

if (Math.abs(deductionResult - expected) < 0.001) {
    console.log("PASS: Logic matches requirements.");
} else {
    console.log(`FAIL: Expected ${expected}, got ${deductionResult}`);
}

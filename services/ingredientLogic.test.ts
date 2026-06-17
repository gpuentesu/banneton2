import{describe, it, expect} from 'vitest';
import{computeIngredientRealCost,
    computeBruteCostPerPound,
    computeBruteCostPerKilo,
    computeRealCostPerPound,
    computeRealCostPerKilo,
    computeHydrationAmount} from './ingredientLogic';

describe("1. computeIngredientRealCost", () => {

    it("It should return the same cost if the loss is 0", () => {
        const result = computeIngredientRealCost({ costPerGram: 100, lossPercentage: 0 });
        expect(result).toBe(100);
    });

    it("It should calculate correctly with a standard loss (e.g., 50%)", () => {
        const result = computeIngredientRealCost({ costPerGram: 10, lossPercentage: 50 });
        expect(result).toBe(20); 
    });

    it("It should handle float percentages correctly (e.g., 33.3%)", () => {
        const result = computeIngredientRealCost({ costPerGram: 10, lossPercentage: 33.3 });
        expect(result).toBe(14.9925); 
    });

    it("It should throw an error if loss is 100%", () => {
        expect(() => {
            computeIngredientRealCost({ costPerGram: 10, lossPercentage: 100 });
        }).toThrow("Must be a percentage lesser than 100 or else there won't be something to work with");
    });

    it("It should throw an error if loss is out of bounds or negative", () => {
        expect(() => {
            computeIngredientRealCost({ costPerGram: 10, lossPercentage: 150 });
        }).toThrow("It must be a percentage between 0 and 100");

        expect(() => {
            computeIngredientRealCost({ costPerGram: 10, lossPercentage: -5 });
        }).toThrow("It must be a percentage between 0 and 100");
    });

    it("It should throw an error if the cost is negative", () => {
        expect(() => {
            computeIngredientRealCost({ costPerGram: -10, lossPercentage: 20 });
        }).toThrow("The brute cost can't be negative");
    });
});


describe("2. computeBruteCostPerPound", () => {

    it("It should multiply the cost by the Colombian pound constant (500)", () => {
        const result = computeBruteCostPerPound({ costPerGram: 5, lossPercentage: 0 });
        expect(result).toBe(2500); 
    });

    it("It should return 0 if the cost is 0", () => {
        const result = computeBruteCostPerPound({ costPerGram: 0, lossPercentage: 0 });
        expect(result).toBe(0);
    });

    it("It should throw an error if the cost is negative", () => {
        expect(() => {
            computeBruteCostPerPound({ costPerGram: -5, lossPercentage: 0 });
        }).toThrow("The brute cost can't be negative");
    });
});


describe("3. computeBruteCostPerKilo", () => {

    it("It should multiply the cost by the kilo constant (1000)", () => {
        const result = computeBruteCostPerKilo({ costPerGram: 5, lossPercentage: 0 });
        expect(result).toBe(5000);
    });

    it("It should return 0 if the cost is 0", () => {
        const result = computeBruteCostPerKilo({ costPerGram: 0, lossPercentage: 0 });
        expect(result).toBe(0);
    });

    it("It should throw an error if the cost is negative", () => {
        expect(() => {
            computeBruteCostPerKilo({ costPerGram: -5, lossPercentage: 0 });
        }).toThrow("The brute cost can't be negative");
    });
});


describe("4. computeRealCostPerPound", () => {

    it("It should calculate correctly with a positive cost and valid loss", () => {
        const result = computeRealCostPerPound({ costPerGram: 10, lossPercentage: 50 });
        expect(result).toBe(10000); 
    });

    it("It should return 0 if the cost is 0", () => {
        const result = computeRealCostPerPound({ costPerGram: 0, lossPercentage: 20 });
        expect(result).toBe(0);
    });

    it("It should inherit the error and throw if the cost is negative", () => {
        expect(() => {
            computeRealCostPerPound({ costPerGram: -10, lossPercentage: 20 });
        }).toThrow("The brute cost can't be negative");
    });

    it("It should inherit the error and throw if the loss is out of bounds", () => {
        expect(() => {
            computeRealCostPerPound({ costPerGram: 10, lossPercentage: 110 });
        }).toThrow("It must be a percentage between 0 and 100");
    });
});


describe("5. computeRealCostPerKilo", () => {

    it("It should calculate correctly with a positive cost and valid loss", () => {
        const result = computeRealCostPerKilo({ costPerGram: 10, lossPercentage: 50 });
        expect(result).toBe(20000); 
    });

    it("It should return 0 if the cost is 0", () => {
        const result = computeRealCostPerKilo({ costPerGram: 0, lossPercentage: 20 });
        expect(result).toBe(0);
    });

    it("It should inherit the error and throw if the cost is negative", () => {
        expect(() => {
            computeRealCostPerKilo({ costPerGram: -10, lossPercentage: 20 });
        }).toThrow("The brute cost can't be negative");
    });

    it("It should inherit the error and throw if the loss is out of bounds", () => {
        expect(() => {
            computeRealCostPerKilo({ costPerGram: 10, lossPercentage: -10 });
        }).toThrow("It must be a percentage between 0 and 100");
    });
});


describe("6. computeHydrationAmount", () => {

    it("It should calculate a standard hydration correctly (e.g., 50%)", () => {
        const result = computeHydrationAmount({ hydrationPercentage: 50 });
        expect(result).toBe(0.5);
    });

    it("It should return 0 if hydration is 0%", () => {
        const result = computeHydrationAmount({ hydrationPercentage: 0 });
        expect(result).toBe(0);
    });

    it("It should calculate correctly if hydration is exactly 100%", () => {
        const result = computeHydrationAmount({ hydrationPercentage: 100 });
        expect(result).toBe(1);
    });

    it("It should handle float percentages correctly (e.g., 65.5%)", () => {
        const result = computeHydrationAmount({ hydrationPercentage: 65.5 });
        expect(result).toBe(0.655);
    });

    it("It should throw an error if hydration is negative or out of bounds", () => {
        expect(() => {
            computeHydrationAmount({ hydrationPercentage: -5 });
        }).toThrow("The hydration percentage must be between 0 and 100");

        expect(() => {
            computeHydrationAmount({ hydrationPercentage: 120 });
        }).toThrow("The hydration percentage must be between 0 and 100");
    });
});
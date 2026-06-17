import { describe, it, expect } from "vitest";
import { 
	calclNumberOfSets, 
	calcTimeInOven, 
	CalcHandlingTime, 
	calcFinalOvenTime,
	SetData
} from "../lib/portionCalcLogic"; 

import{computeIngredientRealCost,
    computeBruteCostPerPound,
    computeBruteCostPerKilo,
    computeRealCostPerPound,
    computeRealCostPerKilo,
    computeHydrationAmount} from '../lib/ingredientLogic';

import{
	isCircularyDependent,
	RecipeRelation
} from '../lib/subrecipeLogic';

describe("Oven Time Estimation Functions", () => {

	describe("calclNumberOfSets", () => {
		it("should correctly calculate required sets for a normal flow", () => {
			expect(calclNumberOfSets(50, 10, 2)).toBe(3);
		});

		it("should return 1 if units are less than or equal to the capacity per set", () => {
			expect(calclNumberOfSets(5, 10, 1)).toBe(1);
			expect(calclNumberOfSets(10, 10, 1)).toBe(1);
		});

		it("should return 0 if units are 0 (edge case)", () => {
			expect(calclNumberOfSets(0, 10, 2)).toBe(0);
		});

		it("should throw an error if capacity per set or oven number is less than or equal to 0", () => {
			expect(() => calclNumberOfSets(10, 0, 2)).toThrow();
			expect(() => calclNumberOfSets(10, 10, 0)).toThrow();
			expect(() => calclNumberOfSets(10, -5, 2)).toThrow();
		});
	});

	describe("calcTimeInOven", () => {
		it("should calculate total time by multiplying sets by oven time", () => {
			expect(calcTimeInOven(3, 45)).toBe(135);
		});

		it("should return 0 if sets are 0", () => {
			expect(calcTimeInOven(0, 45)).toBe(0);
		});

		it("should throw an error if oven time is negative", () => {
			expect(() => calcTimeInOven(2, -10)).toThrow();
		});
	});

	describe("CalcHandlingTime", () => {
		it("should calculate handling time by multiplying handling time by sets and ovens if sets > 1", () => {
			expect(CalcHandlingTime(5, 3, 2)).toBe(30);
		});

		it("should return exactly the handlingTime if there is only 1 set (edge case)", () => {
			expect(CalcHandlingTime(5, 1, 4)).toBe(5);
		});

		it("should return 0 if sets are 0", () => {
			expect(CalcHandlingTime(5, 0, 2)).toBe(0);
		});

		it("should throw an error if handling time is negative", () => {
			expect(() => CalcHandlingTime(-5, 2, 2)).toThrow();
		});
	});

	describe("calcFinalOvenTime (Orchestrator)", () => {
        
		it("Happy path: calculates full estimation with standard data", () => {
			const data: SetData = {
				units: 50,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};

			const result = calcFinalOvenTime(data);
			expect(result.setNumber).toBe(3);
			expect(result.totalTimeOven).toBe(90);
			expect(result.totalHandlingTime).toBe(30);
			expect(result.finalTimeMinutes).toBe(120);
		});

		it("Edge case: when units are LESS than the batch capacity (1 single oven)", () => {
			const data: SetData = {
				units: 5,         
				unitsPerSet: 10,
				ovenTime: 60,
				handlingTime: 10,
				ovenNumber: 1
			};

			const result = calcFinalOvenTime(data);
			expect(result.setNumber).toBe(1);
			expect(result.totalTimeOven).toBe(60);
			expect(result.totalHandlingTime).toBe(10);
			expect(result.finalTimeMinutes).toBe(70);
		});

		it("Edge case: when units are MORE than the batch capacity using MULTIPLE ovens", () => {
			const data: SetData = {
				units: 35,        
				unitsPerSet: 10,
				ovenTime: 40,
				handlingTime: 5,
				ovenNumber: 3     
			};

			const result = calcFinalOvenTime(data);
			expect(result.setNumber).toBe(2);
			expect(result.totalTimeOven).toBe(80);
			expect(result.totalHandlingTime).toBe(30);
			expect(result.finalTimeMinutes).toBe(110);
		});

		it("Global edge case: when units are 0", () => {
			const data: SetData = {
				units: 0,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};
			const result = calcFinalOvenTime(data);
			expect(result.finalTimeMinutes).toBe(0);
			expect(result.setNumber).toBe(0);
			expect(result.totalTimeOven).toBe(0);
			expect(result.totalHandlingTime).toBe(0);
		});

		it("should throw an error if any business parameter is negative", () => {
			const invalidData: SetData = {
				units: 10,
				unitsPerSet: -5, // Invalid
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};
			expect(() => calcFinalOvenTime(invalidData)).toThrow();
		});
	});
});

describe("ingredient data computing functions", () => {
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
});
describe("Subrecipe logic functions)", () => {
    
    // Setup for the tests
    const inMemoryRelations: RecipeRelation[] = [
        { parentId: 10, childId: 11 }, 
        { parentId: 11, childId: 12 }, 
    ];

    describe("1. isCircularyDependent (Validation Logic)", () => {

        it("It should return false if adding a new independent ingredient (Happy Path)", () => {
            const hayCiclo = isCircularyDependent(10, 99, inMemoryRelations);
            expect(hayCiclo).toBe(false);
        });

        it("It should return true if a recipe attempts to add itself (Direct Cycle)", () => {
            const hayCiclo = isCircularyDependent(10, 10, inMemoryRelations);
            expect(hayCiclo).toBe(true);
        });

        it("It should return true if an indirect circular dependency is created (A -> B -> C -> A)", () => {
            const hayCiclo = isCircularyDependent(12, 10, inMemoryRelations);
            expect(hayCiclo).toBe(true);
        });

        it("It should return false if two different recipes use the same sub-recipe (Legal Reuse)", () => {
            const hayCiclo = isCircularyDependent(20, 11, inMemoryRelations);
            expect(hayCiclo).toBe(false);
        });
    });
});
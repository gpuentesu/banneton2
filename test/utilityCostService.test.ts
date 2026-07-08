import { describe, it, expect, beforeEach } from "vitest";
import { updateTariffs, getTariffs, computeServiceCosts } from "../services/utilityCostService";
import { DEFAULT_UTILITY_TARIFFS } from "../domain/data/utilities";
import { RECIPE_FOR_COST_CALCULATION } from "../domain/data/utilities";
import type { UtilityTariffs } from "../domain/types/utilities";

function validTariffs(): UtilityTariffs {
	return structuredClone(DEFAULT_UTILITY_TARIFFS);
}

beforeEach(() => {
	updateTariffs(validTariffs());
});

describe("CU_13: updateTariffs — tariff validation and global state mutation", () => {
	describe("FA1 — validation: negative water pricePerLiter", () => {
		it("should return a single validation error for negative water pricePerLiter", () => {
			const bad = validTariffs();
			bad.water.pricePerLiter = -1;

			const result = updateTariffs(bad);

			expect(result.errors).toBeDefined();
			expect(result.errors).toHaveLength(1);
			expect(result.errors![0].field).toBe("water.pricePerLiter");
		});
	});

	describe("FA2 — validation: negative gas pricePerHour", () => {
		it("should return a single validation error for negative gas pricePerHour", () => {
			const bad = validTariffs();
			bad.gas.pricePerHour = -500;

			const result = updateTariffs(bad);

			expect(result.errors).toBeDefined();
			expect(result.errors).toHaveLength(1);
			expect(result.errors![0].field).toBe("gas.pricePerHour");
		});
	});

	describe("FA3 — validation: zero ovenPowerKw", () => {
		it("should return a single validation error for zero ovenPowerKw", () => {
			const bad = validTariffs();
			bad.electricity.ovenPowerKw = 0;

			const result = updateTariffs(bad);

			expect(result.errors).toBeDefined();
			expect(result.errors).toHaveLength(1);
			expect(result.errors![0].field).toBe("electricity.ovenPowerKw");
		});
	});

	it("should return validation error for negative electricity pricePerKwh", () => {
		const bad = validTariffs();
		bad.electricity.pricePerKwh = -1;

		const result = updateTariffs(bad);

		expect(result.errors).toHaveLength(1);
		expect(result.errors![0].field).toBe("electricity.pricePerKwh");
	});

	it("should return validation error for negative fixedSurcharge", () => {
		const bad = validTariffs();
		bad.electricity.fixedSurcharge = -100;

		const result = updateTariffs(bad);

		expect(result.errors).toHaveLength(1);
		expect(result.errors![0].field).toBe("electricity.fixedSurcharge");
	});

	it("should return validation error for negative additionalUsagePercentage", () => {
		const bad = validTariffs();
		bad.water.additionalUsagePercentage = -5;

		const result = updateTariffs(bad);

		expect(result.errors).toHaveLength(1);
		expect(result.errors![0].field).toBe("water.additionalUsagePercentage");
	});

	it("should return multiple errors when several fields are invalid simultaneously", () => {
		const bad = validTariffs();
		bad.water.pricePerLiter = -10;
		bad.gas.pricePerHour = -1;
		bad.electricity.ovenPowerKw = 0;

		const result = updateTariffs(bad);

		expect(result.errors).toBeDefined();
		expect(result.errors!.length).toBeGreaterThanOrEqual(3);
	});

	it("should update global state and return tariffs when all values are valid", () => {
		const newTariffs = validTariffs();
		newTariffs.water.pricePerLiter = 2500;
		newTariffs.gas.pricePerHour = 10000;

		const result = updateTariffs(newTariffs);

		expect(result.tariffs).toBeDefined();
		expect(result.errors).toBeUndefined();
	});

	it("should persist mutated state so that getTariffs() returns the new values", () => {
		const updated = validTariffs();
		updated.water.pricePerLiter = 9999;
		updateTariffs(updated);

		const current = getTariffs();

		expect(current.water.pricePerLiter).toBe(9999);
	});

	it("should NOT mutate state on invalid input (tariffs remain at previous valid values)", () => {
		const before = getTariffs();

		const bad = validTariffs();
		bad.water.pricePerLiter = -100;
		updateTariffs(bad);

		const after = getTariffs();
		expect(after.water.pricePerLiter).toBe(before.water.pricePerLiter);
	});
});

describe("CU_13 — propagation: computeServiceCosts uses global tariffs", () => {
	it("should compute costs with default tariffs and return correct breakdown", () => {
		const summary = computeServiceCosts({
			ingredients: RECIPE_FOR_COST_CALCULATION.ingredients,
			bakingParameters: RECIPE_FOR_COST_CALCULATION.bakingParameters,
		});

		expect(summary.ingredientsCost).toBe(8635);
		expect(summary.services.waterCost).toBe(82800);
		expect(summary.services.gasCost).toBe(3570);
		expect(summary.services.electricityCost).toBe(2107);
		expect(summary.services.subtotalServicesCost).toBe(88477);
		expect(summary.totalCost).toBe(97112);
		expect(summary.costPerUnit).toBe(1619);
	});

	it("should reflect updated water tariff in computed costs (FA1 propagation)", () => {
		const updated = validTariffs();
		updated.water.pricePerLiter = 2000;
		updateTariffs(updated);

		const summary = computeServiceCosts({
			ingredients: RECIPE_FOR_COST_CALCULATION.ingredients,
			bakingParameters: RECIPE_FOR_COST_CALCULATION.bakingParameters,
		});

		expect(summary.services.waterCost).toBe(138000);
		expect(summary.costPerUnit).toBe(2539);
	});

	it("should reflect updated gas tariff in computed costs (FA2 propagation)", () => {
		const updated = validTariffs();
		updated.gas.pricePerHour = 12000;
		updateTariffs(updated);

		const summary = computeServiceCosts({
			ingredients: RECIPE_FOR_COST_CALCULATION.ingredients,
			bakingParameters: RECIPE_FOR_COST_CALCULATION.bakingParameters,
		});

		expect(summary.services.gasCost).toBe(5040);
	});

	it("should reflect updated electricity tariff in computed costs (FA3 propagation)", () => {
		const updated = validTariffs();
		updated.electricity.ovenPowerKw = 7;
		updateTariffs(updated);

		const summary = computeServiceCosts({
			ingredients: RECIPE_FOR_COST_CALCULATION.ingredients,
			bakingParameters: RECIPE_FOR_COST_CALCULATION.bakingParameters,
		});

		expect(summary.services.electricityCost).toBe(2749);
	});

	it("should return zero costPerUnit when unitsPerBatch is zero", () => {
		const zeroBatch = {
			ingredients: RECIPE_FOR_COST_CALCULATION.ingredients,
			bakingParameters: { bakingTimeHours: 0.5, unitsPerBatch: 0 },
		};

		const summary = computeServiceCosts(zeroBatch);

		expect(summary.costPerUnit).toBe(0);
	});
});

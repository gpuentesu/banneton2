import { describe, it, expect, vi, afterEach } from "vitest";
import {
	openSession,
	modifyIngredientQuantity,
	getSessionMetrics,
} from "../services/sandboxService";

afterEach(() => {
	vi.useRealTimers();
});

function createActiveSession(): string {
	const { session } = openSession("fr_001");
	return session.sessionId;
}

describe("CU_17: modifyIngredientQuantity — ingredient modification in sandbox session", () => {
	it("should return error when session ID does not exist (NOT_FOUND)", () => {
		const result = modifyIngredientQuantity("non-existent-session", "i_harina", 600);

		expect(result.error).toBeDefined();
		expect(result.error).toContain("no encontrada");
		expect(result.session).toBeUndefined();
	});

	it("should return error when session has expired (expiration guard)", () => {
		vi.useFakeTimers();

		const sessionId = createActiveSession();
		vi.advanceTimersByTime(31 * 60 * 1000);

		const result = modifyIngredientQuantity(sessionId, "i_harina", 600);

		expect(result.error).toBeDefined();
		expect(result.error).toContain("expirado");
	});

	it("should return error when ingredient ID does not exist in the session", () => {
		const sessionId = createActiveSession();

		const result = modifyIngredientQuantity(sessionId, "i_NONEXISTENT", 999);

		expect(result.error).toBeDefined();
		expect(result.error).toContain("no encontrado");
		expect(result.session).toBeUndefined();
	});

	it("should successfully modify an ingredient quantity and return the updated session", () => {
		const sessionId = createActiveSession();

		const result = modifyIngredientQuantity(sessionId, "i_harina", 600);

		expect(result.error).toBeUndefined();
		expect(result.session).toBeDefined();
	});

	it("should apply the new quantity value to the ingredient in the session", () => {
		const sessionId = createActiveSession();

		const result = modifyIngredientQuantity(sessionId, "i_harina", 600);

		const ingredient = result.session!.modifiedIngredients.find((i) => i.id === "i_harina");
		expect(ingredient).toBeDefined();
		expect(ingredient!.quantityGrams).toBe(600);
	});

	it("should record the modification in the session modifications array", () => {
		const sessionId = createActiveSession();

		const result = modifyIngredientQuantity(sessionId, "i_harina", 600);

		expect(result.session!.modifications).toHaveLength(1);
		const mod = result.session!.modifications[0];
		expect(mod.componentId).toBe("i_harina");
		expect(mod.field).toBe("quantityGrams");
		expect(mod.previousValue).toBe(500);
		expect(mod.newValue).toBe(600);
	});

	it("should accumulate multiple modifications in the modifications history", () => {
		const sessionId = createActiveSession();

		modifyIngredientQuantity(sessionId, "i_harina", 600);
		modifyIngredientQuantity(sessionId, "i_mantequilla", 200);

		const result = modifyIngredientQuantity(sessionId, "i_sal", 15);

		expect(result.session!.modifications.length).toBeGreaterThanOrEqual(3);
	});

	it("should keep session active after modification (lastActivityAt refresh)", () => {
		const sessionId = createActiveSession();

		modifyIngredientQuantity(sessionId, "i_harina", 700);

		const secondOp = modifyIngredientQuantity(sessionId, "i_agua", 300);
		expect(secondOp.error).toBeUndefined();
	});

	it("should preserve other ingredients when modifying one ingredient", () => {
		const sessionId = createActiveSession();

		const { session } = modifyIngredientQuantity(sessionId, "i_harina", 800);

		const unchanged = session!.modifiedIngredients.find((i) => i.id === "i_sal");
		expect(unchanged).toBeDefined();
		expect(unchanged!.quantityGrams).toBe(10);
	});
});

describe("CU_17 — propagation: metrics re-computation after modification", () => {
	it("should update estimatedTotalCost when an ingredient quantity changes", () => {
		const sessionId = createActiveSession();

		const before = getSessionMetrics(sessionId);
		expect(before.error).toBeUndefined();
		const costBefore = before.metrics!.estimatedTotalCost;

		modifyIngredientQuantity(sessionId, "i_mantequilla", 500);

		const after = getSessionMetrics(sessionId);
		const costAfter = after.metrics!.estimatedTotalCost;

		expect(costAfter).not.toBe(costBefore);
	});

	it("should trigger range warning when hydration drops below minimum", () => {
		const sessionId = createActiveSession();

		modifyIngredientQuantity(sessionId, "i_harina", 20);

		const after = getSessionMetrics(sessionId);
		expect(after.metrics!.rangeWarnings.length).toBeGreaterThanOrEqual(1);
		expect(after.metrics!.rangeWarnings[0].field).toBe("totalHydration");
	});

	it("should trigger range warning when hydration exceeds maximum", () => {
		const sessionId = createActiveSession();

		modifyIngredientQuantity(sessionId, "i_agua", 5000);

		const after = getSessionMetrics(sessionId);
		expect(after.metrics!.rangeWarnings.length).toBeGreaterThanOrEqual(1);
	});

	it("should not produce range warnings for normal hydration values", () => {
		const sessionId = createActiveSession();

		// 500 harina, 300 mantequilla(16% water=48g), 250 agua(100% water=250g), 10 sal
		// Total flour = 510g, total water = 298g -> hydration = round(298/510*100) = 58%
		// 58% is within the [40, 90] range
		const after = getSessionMetrics(sessionId);

		expect(after.metrics!.rangeWarnings).toHaveLength(0);
	});

	it("should update estimatedCostPerUnit after modifying an ingredient", () => {
		const sessionId = createActiveSession();
		const before = getSessionMetrics(sessionId);
		const unitBefore = before.metrics!.estimatedCostPerUnit;

		modifyIngredientQuantity(sessionId, "i_mantequilla", 500);

		const after = getSessionMetrics(sessionId);
		const unitAfter = after.metrics!.estimatedCostPerUnit;

		expect(unitAfter).not.toBe(unitBefore);
	});
});

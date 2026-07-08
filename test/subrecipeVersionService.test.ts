import { describe, it, expect } from "vitest";
import { applyVersion, getVersionList } from "../services/subrecipeVersionService";

describe("CU_10: applyVersion — subrecipe version selection", () => {
	it("should return error when subrecipe ID does not exist (NOT_FOUND)", () => {
		const result = applyVersion("sr_NONEXISTENT", "v1", "fr_001");

		expect(result.error).toBeDefined();
		expect(result.error).toContain("no encontrada");
		expect(result.result).toBeUndefined();
	});

	it("should return error when master recipe ID does not exist (NOT_FOUND)", () => {
		const result = applyVersion("sr_001", "v1", "fr_NONEXISTENT");

		expect(result.error).toBeDefined();
		expect(result.error).toContain("no encontrada");
		expect(result.result).toBeUndefined();
	});

	it("should return error when version ID does not exist in the subrecipe (NOT_FOUND via selectVersion throw)", () => {
		const result = applyVersion("sr_001", "v999", "fr_001");

		expect(result.error).toBeDefined();
		expect(result.result).toBeUndefined();
	});

	it("should successfully select version v2 and compute correct cost variation from v1 baseline", () => {
		const result = applyVersion("sr_001", "v2", "fr_001");

		expect(result.error).toBeUndefined();
		expect(result.result).toBeDefined();

		const r = result.result!;
		expect(r.previousVersionId).toBe("v1");
		expect(r.newVersionId).toBe("v2");
		expect(r.costVariationPercentage).toBe(-13);
		expect(r.updatedTotalCost).toBeGreaterThan(0);
		expect(r.updatedTotalHydration).toBeGreaterThan(0);
	});

	it("should mutate global currentVersionId so that getVersionList reflects it", () => {
		const list = getVersionList("sr_001");

		expect(list.currentVersionId).toBe("v2");
		expect(list.versions).toBeDefined();
		expect(list.versions!.length).toBeGreaterThanOrEqual(1);
	});

	it("should compute correct cost variation when selecting v3 after v2", () => {
		const result = applyVersion("sr_001", "v3", "fr_001");

		expect(result.error).toBeUndefined();
		expect(result.result).toBeDefined();

		const r = result.result!;
		expect(r.previousVersionId).toBe("v2");
		expect(r.newVersionId).toBe("v3");
		expect(r.costVariationPercentage).toBe(31);
	});

	it("should compute correct cost variation when going back to v2 from v3", () => {
		const result = applyVersion("sr_001", "v2", "fr_001");

		expect(result.error).toBeUndefined();
		expect(result.result).toBeDefined();

		const r = result.result!;
		expect(r.previousVersionId).toBe("v3");
		expect(r.newVersionId).toBe("v2");
		expect(r.costVariationPercentage).toBe(-24);
	});

	it("should compute total hydration above zero for any valid version switch", () => {
		const result = applyVersion("sr_001", "v1", "fr_001");

		expect(result.error).toBeUndefined();
		expect(result.result!.updatedTotalHydration).toBeGreaterThan(0);
	});

	it("should work with subrecipe sr_002 (only one version)", () => {
		const result = applyVersion("sr_002", "v1", "fr_001");

		expect(result.error).toBeUndefined();
		expect(result.result).toBeDefined();
		expect(result.result!.newVersionId).toBe("v1");
		expect(result.result!.updatedTotalCost).toBeGreaterThan(0);
	});
});

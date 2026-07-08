import { describe, test, expect } from "vitest";
import { validateEnvironmentParameters, isWithinRange } from "../domain/environmentLogic";
import { RegisterEnvironmentCommand } from "../domain/types/environment";

function baseCommand(overrides: Partial<RegisterEnvironmentCommand> = {}): RegisterEnvironmentCommand {
	return {
		humedadRelativa: 65,
		temperaturaAmbiente: 22,
		altitud: 2600,
		presionBarometrica: 748,
		ciudadReferencia: "Bogotá, Colombia",
		...overrides,
	};
}

describe("environmentLogic — RF_08 Registrar variables geográficas y ambientales", () => {
	test("no reporta errores para un comando válido y completo", () => {
		expect(validateEnvironmentParameters(baseCommand())).toEqual([]);
	});

	test("rechaza humedad relativa fuera del rango 0–100", () => {
		const errors = validateEnvironmentParameters(baseCommand({ humedadRelativa: 120 }));
		expect(errors.some((e) => e.field === "humedadRelativa")).toBe(true);
	});

	test("rechaza temperatura ambiente fuera del rango -10–50", () => {
		const errors = validateEnvironmentParameters(baseCommand({ temperaturaAmbiente: 80 }));
		expect(errors.some((e) => e.field === "temperaturaAmbiente")).toBe(true);
	});

	test("acepta temperaturas negativas dentro del rango", () => {
		expect(validateEnvironmentParameters(baseCommand({ temperaturaAmbiente: -5 }))).toEqual([]);
	});

	test("rechaza altitud fuera del rango 0–5000", () => {
		const errors = validateEnvironmentParameters(baseCommand({ altitud: 6000 }));
		expect(errors.some((e) => e.field === "altitud")).toBe(true);
	});

	test("rechaza presión barométrica fuera del rango 300–1100", () => {
		const errors = validateEnvironmentParameters(baseCommand({ presionBarometrica: 200 }));
		expect(errors.some((e) => e.field === "presionBarometrica")).toBe(true);
	});

	test("exige que ningún valor esté vacío (NaN)", () => {
		const errors = validateEnvironmentParameters(baseCommand({ humedadRelativa: NaN }));
		expect(errors.some((e) => e.field === "humedadRelativa")).toBe(true);
	});

	test("isWithinRange respeta los límites de cada variable", () => {
		expect(isWithinRange("altitud", 0)).toBe(true);
		expect(isWithinRange("altitud", 5000)).toBe(true);
		expect(isWithinRange("altitud", 5001)).toBe(false);
	});
});

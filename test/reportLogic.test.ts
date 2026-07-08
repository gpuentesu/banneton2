import { describe, test, expect } from "vitest";
import {
	validateProductionReport,
	validateBatches,
	computeBatchesTotal,
} from "../domain/reportLogic";
import { RegisterProductionReportCommand } from "../domain/types/report";

function baseCommand(overrides: Partial<RegisterProductionReportCommand> = {}): RegisterProductionReportCommand {
	return {
		idReceta: 1,
		fechaProduccion: "2025-04-30",
		horaProduccion: "09:08",
		cantidadProducida: 24,
		unidadMedida: "unidades",
		idResponsable: 3,
		...overrides,
	};
}

describe("reportLogic — RF_16 Generar reporte de producción", () => {
	describe("validateProductionReport", () => {
		test("no reporta errores para un comando válido y completo", () => {
			const errors = validateProductionReport(baseCommand());
			expect(errors).toEqual([]);
		});

		test("exige receta activa (idReceta)", () => {
			const errors = validateProductionReport(baseCommand({ idReceta: 0 }));
			expect(errors.some((e) => e.field === "idReceta")).toBe(true);
		});

		test("exige fecha con formato YYYY-MM-DD", () => {
			const errors = validateProductionReport(baseCommand({ fechaProduccion: "30/04/2025" }));
			expect(errors.some((e) => e.field === "fechaProduccion")).toBe(true);
		});

		test("exige hora con formato HH:mm", () => {
			const errors = validateProductionReport(baseCommand({ horaProduccion: "9:08am" }));
			expect(errors.some((e) => e.field === "horaProduccion")).toBe(true);
		});

		test("exige cantidad producida mayor que cero", () => {
			const errors = validateProductionReport(baseCommand({ cantidadProducida: 0 }));
			expect(errors.some((e) => e.field === "cantidadProducida")).toBe(true);
		});

		test("exige unidad de medida válida", () => {
			const errors = validateProductionReport(
				// @ts-expect-error probamos una unidad inválida a propósito
				baseCommand({ unidadMedida: "litros" }),
			);
			expect(errors.some((e) => e.field === "unidadMedida")).toBe(true);
		});

		test("exige personal responsable", () => {
			const errors = validateProductionReport(baseCommand({ idResponsable: 0 }));
			expect(errors.some((e) => e.field === "idResponsable")).toBe(true);
		});

		test("rechaza observaciones demasiado largas", () => {
			const errors = validateProductionReport(baseCommand({ observaciones: "a".repeat(501) }));
			expect(errors.some((e) => e.field === "observaciones")).toBe(true);
		});
	});

	describe("validateBatches / computeBatchesTotal", () => {
		test("acepta tandas cuya suma coincide con la cantidad producida", () => {
			const tandas = [
				{ numeroTanda: 1, cantidad: 8 },
				{ numeroTanda: 2, cantidad: 8 },
				{ numeroTanda: 3, cantidad: 8 },
			];
			expect(computeBatchesTotal(tandas)).toBe(24);
			expect(validateBatches(tandas, 24)).toEqual([]);
		});

		test("rechaza tandas cuya suma no coincide con la cantidad producida", () => {
			const tandas = [
				{ numeroTanda: 1, cantidad: 8 },
				{ numeroTanda: 2, cantidad: 8 },
			];
			const errors = validateBatches(tandas, 24);
			expect(errors.some((e) => e.field === "tandas")).toBe(true);
		});

		test("rechaza números de tanda repetidos", () => {
			const tandas = [
				{ numeroTanda: 1, cantidad: 12 },
				{ numeroTanda: 1, cantidad: 12 },
			];
			const errors = validateBatches(tandas, 24);
			expect(errors.some((e) => e.field === "tandas" && e.message.includes("repetido"))).toBe(true);
		});

		test("rechaza cantidades de tanda no positivas", () => {
			const tandas = [{ numeroTanda: 1, cantidad: 0 }];
			const errors = validateBatches(tandas, 0);
			expect(errors.some((e) => e.field === "tandas")).toBe(true);
		});
	});
});

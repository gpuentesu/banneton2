import { describe, test, expect } from "vitest";
import {
	buildChecklistItems,
	validateWorkshopSession,
	computeProgress,
} from "../domain/workshopLogic";
import { CreateWorkshopSessionCommand } from "../domain/types/workshop";

function baseCommand(overrides: Partial<CreateWorkshopSessionCommand> = {}): CreateWorkshopSessionCommand {
	return {
		idReceta: 1,
		ingredientes: [
			{ descripcion: "Harina de trigo T55", cantidad: 500, unidadMedida: "g" },
			{ descripcion: "Levadura fresca", cantidad: 15, unidadMedida: "g" },
		],
		pasos: ["Mezcla inicial (amasado 5 min)", "Incorporar mantequilla poco a poco"],
		...overrides,
	};
}

describe("workshopLogic — RF_15 Verificar ingredientes y pasos", () => {
	describe("buildChecklistItems", () => {
		test("ordena ingredientes primero y luego pasos con orden continuo", () => {
			const items = buildChecklistItems(baseCommand());
			expect(items.map((i) => i.tipo)).toEqual(["ingrediente", "ingrediente", "paso", "paso"]);
			expect(items.map((i) => i.orden)).toEqual([1, 2, 3, 4]);
		});

		test("conserva cantidad y unidad de los ingredientes y las anula en los pasos", () => {
			const items = buildChecklistItems(baseCommand());
			expect(items[0]).toMatchObject({ descripcion: "Harina de trigo T55", cantidad: 500, unidadMedida: "g" });
			expect(items[2]).toMatchObject({ tipo: "paso", cantidad: null, unidadMedida: null });
		});

		test("ignora descripciones vacías", () => {
			const items = buildChecklistItems(baseCommand({ pasos: ["  ", "Boleado y formado"] }));
			const pasos = items.filter((i) => i.tipo === "paso");
			expect(pasos).toHaveLength(1);
			expect(pasos[0].descripcion).toBe("Boleado y formado");
		});
	});

	describe("validateWorkshopSession", () => {
		test("no reporta errores para una receta con ítems", () => {
			const command = baseCommand();
			const items = buildChecklistItems(command);
			expect(validateWorkshopSession(command, items)).toEqual([]);
		});

		test("exige una receta activa", () => {
			const command = baseCommand({ idReceta: 0 });
			const items = buildChecklistItems(command);
			expect(validateWorkshopSession(command, items).some((e) => e.field === "idReceta")).toBe(true);
		});

		test("rechaza una lista de verificación vacía", () => {
			const command = baseCommand({ ingredientes: [], pasos: [] });
			const items = buildChecklistItems(command);
			expect(validateWorkshopSession(command, items).some((e) => e.field === "items")).toBe(true);
		});
	});

	describe("computeProgress", () => {
		test("calcula porcentaje y pendientes", () => {
			const progress = computeProgress([
				{ completado: true },
				{ completado: true },
				{ completado: false },
				{ completado: false },
			]);
			expect(progress).toMatchObject({ total: 4, completados: 2, pendientes: 2, porcentaje: 50, procesoCompleto: false });
		});

		test("marca procesoCompleto cuando todos los ítems están completados", () => {
			const progress = computeProgress([{ completado: true }, { completado: true }]);
			expect(progress.procesoCompleto).toBe(true);
			expect(progress.porcentaje).toBe(100);
		});

		test("una lista vacía no está completa", () => {
			const progress = computeProgress([]);
			expect(progress.procesoCompleto).toBe(false);
			expect(progress.porcentaje).toBe(0);
		});
	});
});

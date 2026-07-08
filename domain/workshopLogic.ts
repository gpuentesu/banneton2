// domain/workshopLogic.ts
// RF_15 — Verificar ingredientes y pasos de elaboración (Modo Taller)
// Reglas de negocio puras: arma la lista de verificación a partir de los
// ingredientes y pasos de la receta activa, y calcula el avance.

import {
	CreateWorkshopSessionCommand,
	WorkshopChecklistItem,
	WorkshopProgress,
	WorkshopValidationError,
} from "./types/workshop";

/**
 * Construye la lista de verificación ordenada (ingredientes primero, luego
 * pasos), como la muestra el mockup de RF_15. El `orden` es global y continuo.
 */
export function buildChecklistItems(
	command: CreateWorkshopSessionCommand,
): WorkshopChecklistItem[] {
	const items: WorkshopChecklistItem[] = [];
	let orden = 1;

	for (const ing of command.ingredientes ?? []) {
		const descripcion = ing.descripcion?.trim();
		if (!descripcion) {continue;}
		items.push({
			tipo: "ingrediente",
			descripcion,
			cantidad: ing.cantidad ?? null,
			unidadMedida: ing.unidadMedida?.trim() || null,
			orden: orden++,
		});
	}

	for (const paso of command.pasos ?? []) {
		const descripcion = paso?.trim();
		if (!descripcion) {continue;}
		items.push({
			tipo: "paso",
			descripcion,
			cantidad: null,
			unidadMedida: null,
			orden: orden++,
		});
	}

	return items;
}

/**
 * Valida que la sesión de taller pueda crearse: receta válida y al menos un
 * ítem que verificar (precondición: receta con ingredientes y pasos definidos).
 */
export function validateWorkshopSession(
	command: CreateWorkshopSessionCommand,
	items: WorkshopChecklistItem[],
): WorkshopValidationError[] {
	const errors: WorkshopValidationError[] = [];

	if (!command.idReceta || command.idReceta <= 0) {
		errors.push({ field: "idReceta", message: "Debe seleccionar una receta activa" });
	}

	if (items.length === 0) {
		errors.push({
			field: "items",
			message: "La receta no tiene ingredientes ni pasos para verificar",
		});
	}

	return errors;
}

/**
 * Calcula el avance de una lista de verificación. `procesoCompleto` es true
 * solo cuando todos los ítems están marcados (paso 6 del flujo normal).
 */
export function computeProgress(
	items: { completado: boolean }[],
): WorkshopProgress {
	const total = items.length;
	const completados = items.filter((i) => i.completado).length;
	const pendientes = total - completados;
	const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100);

	return {
		total,
		completados,
		pendientes,
		porcentaje,
		procesoCompleto: total > 0 && completados === total,
	};
}

// domain/reportLogic.ts
// RF_16 — Generar reporte de producción
// Reglas de negocio puras (sin acceso a base de datos), reutilizando el mismo
// estilo de domain/ingredientLogic.ts: funciones puras que validan o calculan.

import {
	PRODUCTION_UNITS,
	ProductionBatchInput,
	ProductionReportValidationError,
	RegisterProductionReportCommand,
} from "./types/report";

const BATCH_SUM_TOLERANCE = 0.01;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Valida los campos obligatorios de un reporte de producción según el
 * FLUJO NORMAL (paso 4) de RF_16: fecha, hora, lote, cantidad y responsable.
 * Retorna un arreglo vacío si el comando es válido.
 */
export function validateProductionReport(
	command: RegisterProductionReportCommand,
): ProductionReportValidationError[] {
	const errors: ProductionReportValidationError[] = [];

	if (!command.idReceta || command.idReceta <= 0) {
		errors.push({ field: "idReceta", message: "Debe seleccionar una receta activa" });
	}

	if (!command.fechaProduccion || !DATE_REGEX.test(command.fechaProduccion)) {
		errors.push({ field: "fechaProduccion", message: "La fecha de producción es obligatoria y debe tener formato YYYY-MM-DD" });
	}

	if (!command.horaProduccion || !TIME_REGEX.test(command.horaProduccion)) {
		errors.push({ field: "horaProduccion", message: "La hora de producción es obligatoria y debe tener formato HH:mm" });
	}

	if (command.identificadorLote !== undefined && command.identificadorLote.trim().length === 0) {
		errors.push({ field: "identificadorLote", message: "El identificador de lote no puede estar vacío" });
	}

	if (command.cantidadProducida === undefined || command.cantidadProducida === null || Number.isNaN(command.cantidadProducida)) {
		errors.push({ field: "cantidadProducida", message: "La cantidad producida es obligatoria" });
	} else if (command.cantidadProducida <= 0) {
		errors.push({ field: "cantidadProducida", message: "La cantidad producida debe ser mayor que cero" });
	}

	if (!command.unidadMedida || !PRODUCTION_UNITS.includes(command.unidadMedida)) {
		errors.push({ field: "unidadMedida", message: `La unidad de medida debe ser una de: ${PRODUCTION_UNITS.join(", ")}` });
	}

	if (!command.idResponsable || command.idResponsable <= 0) {
		errors.push({ field: "idResponsable", message: "El personal responsable es obligatorio" });
	}

	if (command.observaciones !== undefined && command.observaciones.length > 500) {
		errors.push({ field: "observaciones", message: "Las observaciones no pueden superar 500 caracteres" });
	}

	if (command.tandas && command.tandas.length > 0) {
		errors.push(...validateBatches(command.tandas, command.cantidadProducida));
	}

	return errors;
}

/**
 * Valida que las tandas de horneado tengan números únicos, cantidades
 * positivas y que su suma coincida con la cantidad total producida.
 */
export function validateBatches(
	tandas: ProductionBatchInput[],
	cantidadProducida: number,
): ProductionReportValidationError[] {
	const errors: ProductionReportValidationError[] = [];

	const seenNumbers = new Set<number>();
	for (const tanda of tandas) {
		if (!tanda.numeroTanda || tanda.numeroTanda <= 0) {
			errors.push({ field: "tandas", message: "Cada tanda debe tener un número mayor que cero" });
		}
		if (seenNumbers.has(tanda.numeroTanda)) {
			errors.push({ field: "tandas", message: `El número de tanda ${tanda.numeroTanda} está repetido` });
		}
		seenNumbers.add(tanda.numeroTanda);

		if (tanda.cantidad === undefined || tanda.cantidad === null || tanda.cantidad <= 0) {
			errors.push({ field: "tandas", message: `La tanda ${tanda.numeroTanda} debe tener una cantidad mayor que cero` });
		}
	}

	if (!Number.isNaN(cantidadProducida)) {
		const total = computeBatchesTotal(tandas);
		if (Math.abs(total - cantidadProducida) > BATCH_SUM_TOLERANCE) {
			errors.push({
				field: "tandas",
				message: `La suma de las tandas (${total}) no coincide con la cantidad producida (${cantidadProducida})`,
			});
		}
	}

	return errors;
}

export function computeBatchesTotal(tandas: ProductionBatchInput[]): number {
	return Number(tandas.reduce((sum, t) => sum + (t.cantidad || 0), 0).toFixed(2));
}

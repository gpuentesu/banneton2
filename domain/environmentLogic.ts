// domain/environmentLogic.ts
// RF_08 — Registrar variables geográficas y ambientales
// Reglas de negocio puras (sin acceso a base de datos), mismo estilo que
// domain/reportLogic.ts: valida que cada variable esté dentro de su rango.

import {
	ENVIRONMENT_RANGES,
	EnvironmentField,
	EnvironmentValidationError,
	RegisterEnvironmentCommand,
} from "./types/environment";

/**
 * Valida que las variables geográficas y ambientales estén dentro de los
 * rangos aceptables (paso 4 del FLUJO NORMAL de RF_08). Retorna un arreglo
 * vacío si el comando es válido.
 */
export function validateEnvironmentParameters(
	command: RegisterEnvironmentCommand,
): EnvironmentValidationError[] {
	const errors: EnvironmentValidationError[] = [];

	(Object.keys(ENVIRONMENT_RANGES) as EnvironmentField[]).forEach((field) => {
		const value = command[field];
		const range = ENVIRONMENT_RANGES[field];

		if (value === undefined || value === null || Number.isNaN(value)) {
			errors.push({ field, message: `${range.label} es obligatoria` });
			return;
		}

		if (value < range.min || value > range.max) {
			errors.push({
				field,
				message: `${range.label} debe estar entre ${range.min} y ${range.max} ${range.unit}`,
			});
		}
	});

	if (command.ciudadReferencia !== undefined && command.ciudadReferencia.length > 100) {
		errors.push({ field: "ciudadReferencia", message: "La ciudad de referencia no puede superar 100 caracteres" });
	}

	return errors;
}

/**
 * Indica si un valor puntual está dentro del rango aceptable de su variable.
 * Útil para la validación en vivo del formulario.
 */
export function isWithinRange(field: EnvironmentField, value: number): boolean {
	const range = ENVIRONMENT_RANGES[field];
	return !Number.isNaN(value) && value >= range.min && value <= range.max;
}

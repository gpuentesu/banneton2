// utils/reportUtils.ts
// RF_16 — Generar reporte de producción
// Helpers de formateo / parseo. La generación del identificador de lote
// necesita conocer cuántos reportes existen (acceso a datos), así que la
// secuencia se calcula en el use case; aquí solo vive el formateo puro.

const DEFAULT_PREFIX = "BNN";

/**
 * Construye el identificador de lote con el formato mostrado en el mockup:
 * PREFIJO-AÑO-SECUENCIA (ej. "BNN-2025-0047").
 */
export function formatLoteIdentifier(
	sequence: number,
	referenceDate: Date = new Date(),
	prefix: string = DEFAULT_PREFIX,
): string {
	const year = referenceDate.getFullYear();
	const paddedSequence = String(sequence).padStart(4, "0");
	return `${prefix}-${year}-${paddedSequence}`;
}

/**
 * Convierte "HH:mm" a un Date UTC "neutro" (1970-01-01) compatible con
 * columnas @db.Time de Prisma/Postgres.
 */
export function parseTimeOfDay(time: string): Date {
	return new Date(`1970-01-01T${time}:00.000Z`);
}

/**
 * Convierte un Date almacenado en una columna @db.Time de vuelta a "HH:mm".
 */
export function formatTimeOfDay(date: Date): string {
	const hours = String(date.getUTCHours()).padStart(2, "0");
	const minutes = String(date.getUTCMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
}

/**
 * Convierte "YYYY-MM-DD" a un Date UTC compatible con columnas @db.Date.
 */
export function parseDateOnly(date: string): Date {
	return new Date(`${date}T00:00:00.000Z`);
}

/**
 * Convierte un Date almacenado en una columna @db.Date de vuelta a "YYYY-MM-DD".
 */
export function formatDateOnly(date: Date): string {
	return date.toISOString().slice(0, 10);
}

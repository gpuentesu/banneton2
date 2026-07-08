import { Decimal } from "@prisma/client/runtime/library";

export interface IngredienteCalculado {
	idDetalle: number;
	nombre: string;
	cantidadOriginal: number;
	unidad: string;
	porcentajePanadero: number;
	esPrincipal: boolean;
}

export interface RecetaCalculadaBase {
	idComponente: number;
	unidadesTanda: number;
	pesoTotalOriginal: number;
	ingredientes: IngredienteCalculado[];
}

export interface IngredienteEscalado {
	idDetalle: number;
	nombre: string;
	cantidadNueva: number;
	unidad: string;
	porcentajePanadero: number;
}

export interface RecetaEscaladaResultado {
	idComponente: number;
	pesoTotalObjetivo: number;
	ingredientes: IngredienteEscalado[];
}

/**
 * Calcula los porcentajes panaderos a partir de los datos crudos de la base de datos.
 * Función pura: sin dependencias directas de I/O.
 */
export function procesarPorcentajesBase(
	idComponente: number,
	unidadesTanda: number | null,
	detalles: any[]
): RecetaCalculadaBase {
	if (!detalles || detalles.length === 0) {
		throw new Error("La receta no tiene ingredientes configurados.");
	}

	// Buscar el ingrediente marcado como base panadera
	const ingredientePrincipal = detalles.find(
		(item) => item.catalogo_componente?.ingrediente_base?.aporta_a_base_panadera === true
	);

	// Fallback de seguridad: si ninguno está marcado, usar el de mayor peso
	const principalEfectivo = ingredientePrincipal || detalles.reduce((max, item) => 
		(item.cantidad_usada as Decimal).toNumber() > (max.cantidad_usada as Decimal).toNumber() ? item : max
	);

	const pesoPrincipalOriginal = (principalEfectivo.cantidad_usada as Decimal).toNumber();
	if (pesoPrincipalOriginal === 0) {
		throw new Error("El peso del ingrediente base no puede ser cero.");
	}

	let pesoTotalOriginal = 0;

	const ingredientes: IngredienteCalculado[] = detalles.map((item) => {
		const cantidad = (item.cantidad_usada as Decimal).toNumber();
		pesoTotalOriginal += cantidad;

		const porcentajePanadero = (cantidad / pesoPrincipalOriginal) * 100;

		return {
			idDetalle: item.id_detalle,
			nombre: item.catalogo_componente?.nombre || "Insumo Desconocido",
			cantidadOriginal: cantidad,
			unidad: item.unidad_medida_usada,
			porcentajePanadero: Math.round(porcentajePanadero * 100) / 100,
			esPrincipal: item.id_detalle === principalEfectivo.id_detalle
		};
	});

	return {
		idComponente,
		unidadesTanda: unidadesTanda ?? 1,
		pesoTotalOriginal: Math.round(pesoTotalOriginal * 100) / 100,
		ingredientes
	};
}

/**
 * Aplica la regla de tres inversa para escalar todos los ingredientes basándose en el peso objetivo total
 */
export function escalarReceta(
	recetaBase: RecetaCalculadaBase,
	pesoTotalObjetivo: number
): RecetaEscaladaResultado {
	const sumaPorcentajes = recetaBase.ingredientes.reduce(
		(acc, ing) => acc + ing.porcentajePanadero,
		0
	);

	const nuevoPesoPrincipal = (pesoTotalObjetivo / sumaPorcentajes) * 100;

	const ingredientesEscalados: IngredienteEscalado[] = recetaBase.ingredientes.map((ing) => {
		const cantidadNueva = (nuevoPesoPrincipal * ing.porcentajePanadero) / 100;

		return {
			idDetalle: ing.idDetalle,
			nombre: ing.nombre,
			cantidadNueva: Math.round(cantidadNueva * 100) / 100,
			unidad: ing.unidad,
			porcentajePanadero: ing.porcentajePanadero
		};
	});

	return {
		idComponente: recetaBase.idComponente,
		pesoTotalObjetivo,
		ingredientes: ingredientesEscalados
	};
}

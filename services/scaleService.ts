import { PrismaClient } from "@prisma/client";
import { procesarPorcentajesBase, escalarReceta, RecetaEscaladaResultado } from "../domain/data/sacaleLogic";

const prisma = new PrismaClient();

/**
 * Obtiene la receta de PostgreSQL (Docker), calcula sus bases panaderas y retorna el escalado.
 */
export async function obtenerRecetaEscalada(
	idComponente: number,
	pesoTotalObjetivo: number
): Promise<RecetaEscaladaResultado> {
	// Query profundo respetando los nombres exactos de tu relación de Prisma
	const recetaRaw = await prisma.receta_subreceta.findUnique({
		where: { id_componente: idComponente },
		include: {
			detalle_formulacion: {
				include: {
					catalogo_componente: {
						include: {
							ingrediente_base: true
						}
					}
				}
			}
		}
	});

	if (!recetaRaw) {
		throw new Error(`No se encontró ninguna receta con el ID: ${idComponente}`);
	}

	// 1. Mapeamos y calculamos los porcentajes panaderos en el Dominio
	const recetaBase = procesarPorcentajesBase(
		recetaRaw.id_componente,
		recetaRaw.unidades_tanda,
		recetaRaw.detalle_formulacion
	);

	// 2. Escalamos matemáticamente al peso objetivo y retornamos el contrato
	return escalarReceta(recetaBase, pesoTotalObjetivo);
}

/* eslint-disable camelcase */
import { prisma } from "@/domain/prisma";
export interface UpdateIngredientDTO {
	nombre?: string;
	tipo_componente?: string;
	unidad_medida?: string;
	aporta_a_base_panadera?: boolean;
}

export class ModifyIngredientUseCase {
	async execute(id: number, data: UpdateIngredientDTO) {
		try {
			const existing = await prisma.catalogo_componente.findUnique({
				where: { id_componente: id },
				include: { ingrediente_base: true } 
			});

			if (!existing) {
				throw new Error(`No se encontró el ingrediente con ID ${id}`);
			}

		
			const updatedCatalogo = await prisma.catalogo_componente.update({
				where: { id_componente: id },
				data: {
					nombre: data.nombre !== undefined ? data.nombre : existing.nombre,
					tipo_componente: data.tipo_componente !== undefined ? data.tipo_componente : existing.tipo_componente,
					unidad_medida: data.unidad_medida !== undefined ? data.unidad_medida : existing.unidad_medida,
				}
			});

			
			let updatedIngredienteBase = null;
			if (data.aporta_a_base_panadera !== undefined && existing.ingrediente_base) {
				updatedIngredienteBase = await prisma.ingrediente_base.update({
					where: { id_componente: id },
					data: { aporta_a_base_panadera: data.aporta_a_base_panadera }
				});
			}

			return {
				...updatedCatalogo,
				ingrediente_base: updatedIngredienteBase || existing.ingrediente_base
			};
		} catch (error) {
			throw new Error("Error al modificar el ingrediente", { cause: error });
		}
	}
}

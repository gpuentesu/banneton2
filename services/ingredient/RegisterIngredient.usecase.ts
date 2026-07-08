/* eslint-disable camelcase */
import { prisma } from "@/domain/prisma";
export interface CreateIngredientDTO {
	nombre: string;
	tipo_componente: string;
	unidad_medida: string;
	aporta_a_base_panadera?: boolean;
}

export class RegisterIngredientUseCase {
	async execute(data: CreateIngredientDTO) {
		try {
			const newIngredient = await prisma.catalogo_componente.create({
				data: {
					nombre: data.nombre,
					tipo_componente: data.tipo_componente,
					unidad_medida: data.unidad_medida,

					ingrediente_base: {
						create: {
							aporta_a_base_panadera: data.aporta_a_base_panadera ?? false,
						}
					}
				},

				include: {
					ingrediente_base: true
				}
			});

			return newIngredient;
		} catch (error) {
			throw new Error("Error al registrar el ingrediente", { cause: error });
		}
	}
}

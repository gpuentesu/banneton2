/* eslint-disable camelcase */
import { prisma } from "@/domain/prisma";
export class DeleteIngredientUseCase {
	async execute(id: number) {
		try {
			const existing = await prisma.catalogo_componente.findUnique({
				where: { id_componente: id }
			});

			if (!existing) {
				throw new Error(`No se encontró el ingrediente con ID ${id}`);
			}

			const deletedIngredient = await prisma.catalogo_componente.update({
				where: { id_componente: id },
				data: { activo: false }
			});

			return { 
				message: `Ingrediente con ID ${id} desactivado correctamente`,
				ingrediente: deletedIngredient
			};
		} catch (error) {
			throw new Error("Error al eliminar el ingrediente", { cause: error });
		}
	}
}

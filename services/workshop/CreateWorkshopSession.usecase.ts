// services/workshop/CreateWorkshopSession.usecase.ts
// RF_15 — Cargar la receta en el Modo Taller y generar su lista de verificación.
import { prisma } from "@/domain/prisma";
import { buildChecklistItems, validateWorkshopSession } from "@/domain/workshopLogic";
import {
	CreateWorkshopSessionCommand,
	WorkshopIngredientInput,
	WorkshopValidationError,
} from "@/domain/types/workshop";
import { WORKSHOP_SESSION_INCLUDE, WorkshopSessionWithRelations } from "./workshopSessionInclude";

export interface CreateWorkshopSessionResult {
	session?: WorkshopSessionWithRelations;
	errors?: WorkshopValidationError[];
}

export class CreateWorkshopSessionUseCase {
	async execute(command: CreateWorkshopSessionCommand): Promise<CreateWorkshopSessionResult> {
		if (!command.idReceta || command.idReceta <= 0) {
			return { errors: [{ field: "idReceta", message: "Debe seleccionar una receta activa" }] };
		}

		// --- INFRASTRUCTURE: verificar que exista la receta activa (precondición) ---
		const recipe = await prisma.receta_subreceta.findUnique({
			where: { id_componente: command.idReceta },
		});
		if (!recipe) {
			return { errors: [{ field: "idReceta", message: "La receta activa no existe o fue eliminada" }] };
		}

		// Si el cliente no envía ingredientes, se derivan de la formulación de la
		// receta (RF_03/RF_06) para generar la lista de verificación.
		const ingredientes =
			command.ingredientes && command.ingredientes.length > 0
				? command.ingredientes
				: await this.loadIngredientsFromFormulation(command.idReceta);

		const items = buildChecklistItems({ ...command, ingredientes });

		const errors = validateWorkshopSession(command, items);
		if (errors.length > 0) {
			return { errors };
		}

		const created = await prisma.sesion_taller.create({
			data: {
				id_receta: command.idReceta,
				identificador_lote: command.identificadorLote?.trim() || null,
				estado: "en_progreso",
				creado_por: command.idCreadoPor ?? null,
				items: {
					create: items.map((item) => ({
						tipo: item.tipo,
						descripcion: item.descripcion,
						cantidad: item.cantidad,
						unidad_medida: item.unidadMedida,
						orden: item.orden,
					})),
				},
			},
			include: WORKSHOP_SESSION_INCLUDE,
		});

		return { session: created };
	}

	private async loadIngredientsFromFormulation(idReceta: number): Promise<WorkshopIngredientInput[]> {
		const detalles = await prisma.detalle_formulacion.findMany({
			where: { id_receta_padre: idReceta },
			include: { catalogo_componente: true },
			orderBy: { id_detalle: "asc" },
		});

		return detalles.map((d) => ({
			descripcion: d.catalogo_componente?.nombre ?? `Componente #${d.id_componente_hijo}`,
			cantidad: Number(d.cantidad_usada),
			unidadMedida: d.unidad_medida_usada,
		}));
	}
}

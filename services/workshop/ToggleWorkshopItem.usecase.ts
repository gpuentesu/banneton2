// services/workshop/ToggleWorkshopItem.usecase.ts
// RF_15 — Marca/desmarca un ítem de la lista de verificación, registra el
// tiempo de la acción (paso 4) y actualiza el estado de la sesión.
import { prisma } from "@/domain/prisma";
import { computeProgress } from "@/domain/workshopLogic";
import { WORKSHOP_SESSION_INCLUDE, WorkshopSessionWithRelations } from "./workshopSessionInclude";

export interface ToggleWorkshopItemCommand {
	idSesion: number;
	idItem: number;
	completado: boolean;
}

export interface ToggleWorkshopItemResult {
	session?: WorkshopSessionWithRelations;
	error?: string;
}

export class ToggleWorkshopItemUseCase {
	async execute(command: ToggleWorkshopItemCommand): Promise<ToggleWorkshopItemResult> {
		const item = await prisma.item_verificacion.findUnique({
			where: { id_item: command.idItem },
		});

		if (!item || item.id_sesion !== command.idSesion) {
			return { error: "El ítem no existe en esta sesión de taller" };
		}

		// El sistema registra el tiempo en que se realizó la acción; al desmarcar
		// (corrección de un error) se limpia la marca de tiempo.
		await prisma.item_verificacion.update({
			where: { id_item: command.idItem },
			data: {
				completado: command.completado,
				completado_en: command.completado ? new Date() : null,
			},
		});

		const items = await prisma.item_verificacion.findMany({
			where: { id_sesion: command.idSesion },
			select: { completado: true },
		});
		const progress = computeProgress(items);

		const session = await prisma.sesion_taller.update({
			where: { id_sesion: command.idSesion },
			data: {
				estado: progress.procesoCompleto ? "completada" : "en_progreso",
				actualizado_en: new Date(),
			},
			include: WORKSHOP_SESSION_INCLUDE,
		});

		return { session };
	}
}

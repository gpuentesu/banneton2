// services/workshop/ListWorkshopSessions.usecase.ts
// RF_15 — Lista las sesiones de taller (opcionalmente de una receta) para
// poder seleccionar una y reanudarla.
import { prisma } from "@/domain/prisma";
import { WORKSHOP_SESSION_INCLUDE } from "./workshopSessionInclude";

export class ListWorkshopSessionsUseCase {
	async execute(idReceta?: number) {
		return prisma.sesion_taller.findMany({
			where: idReceta ? { id_receta: idReceta } : undefined,
			include: WORKSHOP_SESSION_INCLUDE,
			orderBy: { creado_en: "desc" },
		});
	}
}

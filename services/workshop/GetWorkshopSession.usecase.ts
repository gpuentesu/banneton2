// services/workshop/GetWorkshopSession.usecase.ts
// RF_15 — Recupera una sesión con su lista de verificación para reanudarla
// (postcondición: el estado persiste si la sesión se interrumpe).
import { prisma } from "@/domain/prisma";
import { WORKSHOP_SESSION_INCLUDE } from "./workshopSessionInclude";

export class GetWorkshopSessionUseCase {
	async execute(idSesion: number) {
		return prisma.sesion_taller.findUnique({
			where: { id_sesion: idSesion },
			include: WORKSHOP_SESSION_INCLUDE,
		});
	}
}

// services/workshop/workshopSessionInclude.ts
import { Prisma } from "@prisma/client";

export const WORKSHOP_SESSION_INCLUDE = {
	items: { orderBy: { orden: "asc" as const } },
	receta_subreceta: { include: { catalogo_componente: true } },
	creador: true,
} satisfies Prisma.sesion_tallerInclude;

export type WorkshopSessionWithRelations = Prisma.sesion_tallerGetPayload<{
	include: typeof WORKSHOP_SESSION_INCLUDE;
}>;

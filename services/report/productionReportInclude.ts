// services/report/productionReportInclude.ts
import { Prisma } from "@prisma/client";

export const PRODUCTION_REPORT_INCLUDE = {
	tanda_produccion: { orderBy: { numero_tanda: "asc" as const } },
	receta_subreceta: { include: { catalogo_componente: true } },
	responsable: true,
	supervisor: true,
} satisfies Prisma.reporte_produccionInclude;

export type ProductionReportWithRelations = Prisma.reporte_produccionGetPayload<{
	include: typeof PRODUCTION_REPORT_INCLUDE;
}>;

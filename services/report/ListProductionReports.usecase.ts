// services/report/ListProductionReports.usecase.ts
import { prisma } from "@/domain/prisma";
import { PRODUCTION_REPORT_INCLUDE } from "./productionReportInclude";

export class ListProductionReportsUseCase {
	async execute() {
		return prisma.reporte_produccion.findMany({
			include: PRODUCTION_REPORT_INCLUDE,
			orderBy: [{ fecha_produccion: "desc" }, { hora_produccion: "desc" }],
		});
	}
}

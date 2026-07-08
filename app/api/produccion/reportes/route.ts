import { NextRequest, NextResponse } from "next/server";
import { RegisterProductionReportUseCase } from "@/services/report/RegisterProductionReport.usecase";
import { ListProductionReportsUseCase } from "@/services/report/ListProductionReports.usecase";
import { RegisterProductionReportCommand } from "@/domain/types/report";

// GET /api/produccion/reportes — Historial de producción (RF_16, postcondición)
export async function GET() {
	try {
		const reports = await new ListProductionReportsUseCase().execute();
		return NextResponse.json({ ok: true, data: reports });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al obtener el historial de producción" },
			{ status: 500 },
		);
	}
}

// POST /api/produccion/reportes — Generar reporte de producción (RF_16)
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as RegisterProductionReportCommand;

		const result = await new RegisterProductionReportUseCase().execute(body);

		if (result.errors) {
			return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
		}

		return NextResponse.json({ ok: true, data: result.report }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al generar el reporte de producción" },
			{ status: 500 },
		);
	}
}

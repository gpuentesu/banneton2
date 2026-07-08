import { NextResponse } from "next/server";
import { prisma } from "@/domain/prisma";
import { formatLoteIdentifier } from "@/utils/reportUtils";

// GET /api/produccion/lote-sugerido — Identificador de lote sugerido para
// pre-cargar el formulario (RF_16, flujo normal paso 2). El identificador
// definitivo se vuelve a calcular al guardar, por si otro reporte se creó
// mientras tanto.
export async function GET() {
	try {
		const now = new Date();
		const yearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));
		const yearEnd = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));

		const count = await prisma.reporte_produccion.count({
			where: { fecha_produccion: { gte: yearStart, lt: yearEnd } },
		});

		return NextResponse.json({ ok: true, data: { identificadorLote: formatLoteIdentifier(count + 1, now) } });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al calcular el identificador de lote sugerido" },
			{ status: 500 },
		);
	}
}

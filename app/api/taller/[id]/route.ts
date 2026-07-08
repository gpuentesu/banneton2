import { NextRequest, NextResponse } from "next/server";
import { GetWorkshopSessionUseCase } from "@/services/workshop/GetWorkshopSession.usecase";
import { computeProgress } from "@/domain/workshopLogic";

// GET /api/taller/[id] — Sesión de taller con su lista de verificación y avance,
// para cargar o reanudar el Modo Taller (RF_15).
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const idSesion = Number(id);
		if (Number.isNaN(idSesion)) {
			return NextResponse.json({ ok: false, error: "Identificador de sesión inválido" }, { status: 400 });
		}

		const session = await new GetWorkshopSessionUseCase().execute(idSesion);
		if (!session) {
			return NextResponse.json({ ok: false, error: "La sesión de taller no existe" }, { status: 404 });
		}

		return NextResponse.json({ ok: true, data: { ...session, progreso: computeProgress(session.items) } });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al obtener la sesión de taller" },
			{ status: 500 },
		);
	}
}

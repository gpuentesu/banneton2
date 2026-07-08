import { NextRequest, NextResponse } from "next/server";
import { CreateWorkshopSessionUseCase } from "@/services/workshop/CreateWorkshopSession.usecase";
import { ListWorkshopSessionsUseCase } from "@/services/workshop/ListWorkshopSessions.usecase";
import { CreateWorkshopSessionCommand } from "@/domain/types/workshop";

// GET /api/taller?receta=<id> — Sesiones de taller (para seleccionar/reanudar) (RF_15).
export async function GET(request: NextRequest) {
	try {
		const recetaParam = request.nextUrl.searchParams.get("receta");
		const idReceta = recetaParam ? Number(recetaParam) : undefined;

		const sessions = await new ListWorkshopSessionsUseCase().execute(
			idReceta && !Number.isNaN(idReceta) ? idReceta : undefined,
		);
		return NextResponse.json({ ok: true, data: sessions });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al obtener las sesiones de taller" },
			{ status: 500 },
		);
	}
}

// POST /api/taller — Cargar una receta en Modo Taller y generar su checklist (RF_15).
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as CreateWorkshopSessionCommand;

		const result = await new CreateWorkshopSessionUseCase().execute(body);

		if (result.errors) {
			return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
		}

		return NextResponse.json({ ok: true, data: result.session }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al iniciar la sesión de taller" },
			{ status: 500 },
		);
	}
}

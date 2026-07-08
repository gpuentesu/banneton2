import { NextRequest, NextResponse } from "next/server";
import { ToggleWorkshopItemUseCase } from "@/services/workshop/ToggleWorkshopItem.usecase";
import { computeProgress } from "@/domain/workshopLogic";

// PATCH /api/taller/[id]/items/[itemId] — Marca/desmarca un ítem de la lista de
// verificación y persiste el avance (RF_15, pasos 3–4 y postcondición).
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; itemId: string }> },
) {
	try {
		const { id, itemId } = await params;
		const idSesion = Number(id);
		const idItem = Number(itemId);
		if (Number.isNaN(idSesion) || Number.isNaN(idItem)) {
			return NextResponse.json({ ok: false, error: "Identificadores inválidos" }, { status: 400 });
		}

		const body = (await request.json()) as { completado?: boolean };
		if (typeof body.completado !== "boolean") {
			return NextResponse.json(
				{ ok: false, error: "El campo 'completado' es obligatorio y debe ser booleano" },
				{ status: 400 },
			);
		}

		const result = await new ToggleWorkshopItemUseCase().execute({
			idSesion,
			idItem,
			completado: body.completado,
		});

		if (result.error) {
			return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
		}

		return NextResponse.json({
			ok: true,
			data: { ...result.session, progreso: computeProgress(result.session!.items) },
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al actualizar el ítem de la lista de verificación" },
			{ status: 500 },
		);
	}
}

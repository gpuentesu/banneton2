import { NextResponse } from "next/server";
import { obtenerRecetaEscalada } from "../../../../services/scaleService";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { idComponente, pesoTotalObjetivo } = body;

		if (!idComponente || !pesoTotalObjetivo) {
			return NextResponse.json(
				{ error: "El ID de receta y el peso objetivo son obligatorios." },
				{ status: 400 }
			);
		}

		const resultado = await obtenerRecetaEscalada(
			Number(idComponente),
			Number(pesoTotalObjetivo)
		);

		return NextResponse.json(resultado);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Error al procesar el escalado panadero" },
			{ status: 500 }
		);
	}
}

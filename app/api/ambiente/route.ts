import { NextRequest, NextResponse } from "next/server";
import { RegisterEnvironmentParametersUseCase } from "@/services/environment/RegisterEnvironmentParameters.usecase";
import { GetEnvironmentParametersUseCase } from "@/services/environment/GetEnvironmentParameters.usecase";
import { RegisterEnvironmentCommand } from "@/domain/types/environment";

// GET /api/ambiente — Perfil ambiental vigente (más reciente), para precargar
// el formulario y el recálculo de recetas (RF_08).
export async function GET() {
	try {
		const parameters = await new GetEnvironmentParametersUseCase().execute();
		return NextResponse.json({ ok: true, data: parameters });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al obtener las variables ambientales" },
			{ status: 500 },
		);
	}
}

// POST /api/ambiente — Registrar variables geográficas y ambientales (RF_08).
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as RegisterEnvironmentCommand;

		const result = await new RegisterEnvironmentParametersUseCase().execute(body);

		if (result.errors) {
			return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
		}

		return NextResponse.json({ ok: true, data: result.parameters }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al registrar las variables ambientales" },
			{ status: 500 },
		);
	}
}

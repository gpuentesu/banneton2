import { NextRequest, NextResponse } from "next/server";
import { getTariffs, updateTariffs } from "../../../services/utilityCostService";

export async function GET() {
	const tariffs = getTariffs();
	return NextResponse.json({ tariffs });
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { tariffs } = body;

	if (!tariffs) {
		return NextResponse.json(
			{ error: "Datos de tarifas requeridos" },
			{ status: 400 },
		);
	}

	const result = updateTariffs(tariffs);
	if (result.errors) {
		return NextResponse.json({ errors: result.errors }, { status: 422 });
	}
	return NextResponse.json(result);
}

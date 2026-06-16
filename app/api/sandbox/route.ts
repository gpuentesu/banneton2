import { NextRequest, NextResponse } from "next/server";
import { openSession } from "../../../services/sandboxService";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { recipeId } = body;

	if (!recipeId) {
		return NextResponse.json(
			{ error: "recipeId es requerido" },
			{ status: 400 },
		);
	}

	const result = openSession(recipeId);
	if (result.error) {
		return NextResponse.json({ error: result.error }, { status: 404 });
	}
	return NextResponse.json({ session: result.session }, { status: 201 });
}

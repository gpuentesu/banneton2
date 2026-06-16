import { NextRequest, NextResponse } from "next/server";
import { getVersionList, applyVersion } from "../../../../services/subrecipeVersionService";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const result = getVersionList(id);
	if (result.error) {
		return NextResponse.json({ error: result.error }, { status: 404 });
	}
	return NextResponse.json(result);
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	const { newVersionId, masterRecipeId } = body;

	if (!newVersionId || !masterRecipeId) {
		return NextResponse.json(
			{ error: "newVersionId y masterRecipeId son requeridos" },
			{ status: 400 },
		);
	}

	const result = applyVersion(id, newVersionId, masterRecipeId);
	if (result.error) {
		const status = result.error.includes("no encontrada") ? 404 : 400;
		return NextResponse.json({ error: result.error }, { status });
	}
	return NextResponse.json(result);
}

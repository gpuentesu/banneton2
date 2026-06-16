import { NextRequest, NextResponse } from "next/server";
import { SUBRECIPES } from "../../../../../../lib/data/subrecipes";
import { findVersionById } from "../../../../../../utils/subrecipeUtils";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string; versionId: string }> },
) {
	const { id, versionId } = await params;
	const subrecipe = SUBRECIPES.find((sr) => sr.id === id);
	if (!subrecipe) {
		return NextResponse.json({ error: "Subreceta no encontrada" }, { status: 404 });
	}

	const version = findVersionById(subrecipe, versionId);
	if (!version) {
		return NextResponse.json({ error: "Versión no encontrada" }, { status: 404 });
	}

	return NextResponse.json({ version });
}

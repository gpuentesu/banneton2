import { NextRequest, NextResponse } from "next/server";
import {
	getSession,
	getComparison,
	getSessionMetrics,
	modifyIngredientQuantity,
	modifyBakingParameter,
	saveSessionAsVersion,
	discardSession,
} from "../../../../services/sandboxService";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const searchParams = request.nextUrl.searchParams;
	const scope = searchParams.get("scope") ?? "session";

	switch (scope) {
		case "comparison": {
			const result = getComparison(id);
			if (result.error) {return NextResponse.json({ error: result.error }, { status: 400 });}
			return NextResponse.json(result);
		}
		case "metrics": {
			const result = getSessionMetrics(id);
			if (result.error) {return NextResponse.json({ error: result.error }, { status: 400 });}
			return NextResponse.json(result);
		}
		default: {
			const result = getSession(id);
			if (result.error) {return NextResponse.json({ error: result.error }, { status: 404 });}
			return NextResponse.json(result);
		}
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	const { action } = body;

	if (!action) {
		return NextResponse.json({ error: "action es requerido" }, { status: 400 });
	}

	switch (action) {
		case "modifyIngredient": {
			const { ingredientId, quantityGrams } = body;
			if (!ingredientId || quantityGrams == null) {
				return NextResponse.json(
					{ error: "ingredientId y quantityGrams son requeridos" },
					{ status: 400 },
				);
			}
			const result = modifyIngredientQuantity(id, ingredientId, quantityGrams);
			if (result.error) {return NextResponse.json({ error: result.error }, { status: 400 });}
			return NextResponse.json(result);
		}
		case "modifyBakingParameter": {
			const { field, value } = body;
			if (!field || value == null) {
				return NextResponse.json(
					{ error: "field y value son requeridos" },
					{ status: 400 },
				);
			}
			const result = modifyBakingParameter(id, field, value);
			if (result.error) {return NextResponse.json({ error: result.error }, { status: 400 });}
			return NextResponse.json(result);
		}
		default:
			return NextResponse.json({ error: `Acción desconocida: ${action}` }, { status: 400 });
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	const { versionName } = body;

	if (!versionName) {
		return NextResponse.json({ error: "versionName es requerido" }, { status: 400 });
	}

	const result = saveSessionAsVersion(id, versionName);
	if (result.error) {return NextResponse.json({ error: result.error }, { status: 400 });}
	return NextResponse.json(result);
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const result = discardSession(id);
	if (result.error) {return NextResponse.json({ error: result.error }, { status: 404 });}
	return NextResponse.json({ success: true });
}

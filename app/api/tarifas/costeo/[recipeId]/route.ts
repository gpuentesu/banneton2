import { NextRequest, NextResponse } from "next/server";
import { RECIPE_FOR_COST_CALCULATION } from "../../../../../lib/data/utilities";
import { computeServiceCosts } from "../../../../../services/utilityCostService";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ recipeId: string }> },
) {
	const { recipeId } = await params;
	const recipe = RECIPE_FOR_COST_CALCULATION;

	if (recipe.id !== recipeId) {
		return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
	}

	const summary = computeServiceCosts({
		ingredients: recipe.ingredients,
		bakingParameters: recipe.bakingParameters,
	});
	return NextResponse.json({ summary });
}

import { VersionSelectionResult } from "../lib/types/subrecipe";
import { SUBRECIPES } from "../lib/data/subrecipes";
import { findMasterRecipeById } from "../lib/data/recipes";
import { getVersionSummaries, selectVersion } from "../utils/subrecipeUtils";

let currentVersionId: string = "v1";

export function getVersionList(subrecipeId: string) {
	const subrecipe = SUBRECIPES.find((sr) => sr.id === subrecipeId);
	if (!subrecipe) {
		return { error: `Subreceta "${subrecipeId}" no encontrada` };
	}

	const summaries = getVersionSummaries(subrecipe);
	return { versions: summaries, currentVersionId };
}

export function applyVersion(
	subrecipeId: string,
	newVersionId: string,
	masterRecipeId: string,
): { result?: VersionSelectionResult; error?: string } {
	const subrecipe = SUBRECIPES.find((sr) => sr.id === subrecipeId);
	if (!subrecipe) {
		return { error: `Subreceta "${subrecipeId}" no encontrada` };
	}

	const masterRecipe = findMasterRecipeById(masterRecipeId);
	if (!masterRecipe) {
		return { error: `Receta maestra "${masterRecipeId}" no encontrada` };
	}

	try {
		const result = selectVersion(subrecipe, currentVersionId, newVersionId, masterRecipe);
		currentVersionId = newVersionId;
		return { result };
	} catch (err) {
		return { error: (err as Error).message };
	}
}

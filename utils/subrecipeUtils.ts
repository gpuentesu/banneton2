import { Subrecipe, SubrecipeVersion, SubrecipeVersionSummary, VersionSelectionResult } from "../domain/types/subrecipe";
import { MasterRecipe } from "../domain/types/sandbox";
import { Ingredient } from "../domain/types/recipe";

export function getVersionSummaries(subrecipe: Subrecipe): SubrecipeVersionSummary[] {
	return subrecipe.versions
		.filter((v) => v.isActive)
		.map((v) => ({
			versionId: v.versionId,
			versionName: v.versionName,
			shortDescription: v.shortDescription,
			estimatedCostPerKg: v.estimatedCostPerKg,
			createdAt: v.createdAt,
		}))
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function findVersionById(subrecipe: Subrecipe, versionId: string): SubrecipeVersion | undefined {
	return subrecipe.versions.find((v) => v.versionId === versionId);
}

export function selectVersion(
	subrecipe: Subrecipe,
	currentVersionId: string,
	newVersionId: string,
	masterRecipe: MasterRecipe,
): VersionSelectionResult {
	const newVersion = findVersionById(subrecipe, newVersionId);
	if (!newVersion) {
		throw new Error(`Version ${newVersionId} not found in subrecipe ${subrecipe.id}`);
	}

	const previousVersion = findVersionById(subrecipe, currentVersionId);

	const replaceIngredients = (ingredients: Ingredient[], newSubrecipeIngredients: Ingredient[]): Ingredient[] => {
		const subrecipeComponent = masterRecipe.components.find((c) => c.type === "subrecipe" && c.id === subrecipe.id);
		if (!subrecipeComponent) {return ingredients;}

		const subrecipeGrams = subrecipeComponent.quantityGrams;
		const scaledIngredients = newSubrecipeIngredients.map((si) => ({
			...si,
			quantityGrams: (si.quantityGrams / newSubrecipeIngredients.reduce((s, i) => s + i.quantityGrams, 0)) * subrecipeGrams,
		}));

		return [...ingredients.filter((i) => !newSubrecipeIngredients.find((si) => si.id === i.id)), ...scaledIngredients];
	};

	const updatedIngredients = replaceIngredients(masterRecipe.ingredients, newVersion.ingredients);

	const updatedTotalCost = updatedIngredients.reduce(
		(sum, i) => sum + i.quantityGrams * i.pricePerGram,
		0,
	);
	const updatedTotalHydration = (() => {
		const totalFlour = updatedIngredients
			.filter((i) => i.waterPercentage === 0)
			.reduce((s, i) => s + i.quantityGrams, 0);
		const totalWater = updatedIngredients
			.filter((i) => i.waterPercentage > 0)
			.reduce((s, i) => s + (i.quantityGrams * i.waterPercentage) / 100, 0);
		return totalFlour > 0 ? Math.round((totalWater / totalFlour) * 100) : 0;
	})();

	const previousCost = previousVersion?.estimatedCostPerKg ?? 0;
	const costVariationPercentage = previousCost > 0
		? Math.round(((newVersion.estimatedCostPerKg - previousCost) / previousCost) * 100)
		: 0;

	return {
		previousVersionId: previousVersion?.versionId ?? "",
		newVersionId: newVersion.versionId,
		costVariationPercentage,
		updatedTotalCost,
		updatedTotalHydration,
	};
}

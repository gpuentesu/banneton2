import { MasterRecipe } from "../types/sandbox";

export const MASTER_RECIPES: MasterRecipe[] = [
	{
		id: "fr_001",
		name: "Medialuna Premium",
		version: "V1",
		components: [
			{ type: "ingredient", id: "i_harina", name: "Harina", quantityGrams: 500 },
			{ type: "ingredient", id: "i_mantequilla", name: "Mantequilla", quantityGrams: 300 },
			{ type: "ingredient", id: "i_agua", name: "Agua", quantityGrams: 250 },
			{ type: "ingredient", id: "i_sal", name: "Sal", quantityGrams: 10 },
			{ type: "subrecipe", id: "sr_001", name: "Masa Base Hojaldre", quantityGrams: 500, selectedVersionId: "v1" },
		],
		ingredients: [
			{ id: "i_harina", name: "Harina", waterPercentage: 0, pricePerGram: 3.2, quantityGrams: 500 },
			{ id: "i_mantequilla", name: "Mantequilla", waterPercentage: 16, pricePerGram: 22, quantityGrams: 300 },
			{ id: "i_agua", name: "Agua", waterPercentage: 100, pricePerGram: 0.1, quantityGrams: 250 },
			{ id: "i_sal", name: "Sal", waterPercentage: 0, pricePerGram: 1, quantityGrams: 10 },
		],
		subrecipeVersions: [],
		bakingParameters: {
			bakingTimeHours: 0.42,
			unitsPerBatch: 60,
		},
	},
];

export function findMasterRecipeById(recipeId: string): MasterRecipe | undefined {
	return MASTER_RECIPES.find((r) => r.id === recipeId);
}

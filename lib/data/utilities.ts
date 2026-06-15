import { UtilityTariffs } from "../types/utilities";
import { MasterRecipe } from "../types/sandbox";

export const DEFAULT_UTILITY_TARIFFS: UtilityTariffs = {
	water: {
		pricePerLiter: 1200,
		additionalUsagePercentage: 15,
	},
	gas: {
		pricePerHour: 8500,
	},
	electricity: {
		pricePerKwh: 900,
		ovenPowerKw: 5.0,
		fixedSurcharge: 500,
	},
};

export const RECIPE_FOR_COST_CALCULATION: MasterRecipe = {
	id: "fr_001",
	name: "Medialuna Premium",
	version: "V1",
	bakingParameters: {
		bakingTimeHours: 0.42,
		unitsPerBatch: 60,
	},
	ingredients: [
		{ id: "i_harina", name: "Harina", waterPercentage: 0, pricePerGram: 3.2, quantityGrams: 500 },
		{ id: "i_mantequilla", name: "Mantequilla", waterPercentage: 16, pricePerGram: 22, quantityGrams: 300 },
		{ id: "i_agua", name: "Agua", waterPercentage: 100, pricePerGram: 0.1, quantityGrams: 250 },
		{ id: "i_sal", name: "Sal", waterPercentage: 0, pricePerGram: 1, quantityGrams: 10 },
		{ id: "i_leche", name: "Leche", waterPercentage: 88, pricePerGram: 2, quantityGrams: 200 },
	],
	components: [],
	subrecipeVersions: [],
};

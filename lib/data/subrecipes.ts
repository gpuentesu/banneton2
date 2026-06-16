import { Subrecipe } from "../types/subrecipe";

export const SUBRECIPES: Subrecipe[] = [
	{
		id: "sr_001",
		name: "Masa Base Hojaldre",
		versions: [
			{
				versionId: "v1",
				versionName: "V1 — Clásica",
				shortDescription: "Formulación original con mantequilla europea",
				estimatedCostPerKg: 12400,
				createdAt: new Date("2024-01-10"),
				isActive: true,
				ingredients: [
					{ id: "i_harina", name: "Harina", waterPercentage: 0, pricePerGram: 3.2, quantityGrams: 500 },
					{ id: "i_mantequilla", name: "Mantequilla europea", waterPercentage: 16, pricePerGram: 22, quantityGrams: 300 },
					{ id: "i_agua", name: "Agua", waterPercentage: 100, pricePerGram: 0.1, quantityGrams: 250 },
					{ id: "i_sal", name: "Sal", waterPercentage: 0, pricePerGram: 1, quantityGrams: 10 },
				],
			},
			{
				versionId: "v2",
				versionName: "V2 — Reducida",
				shortDescription: "Menos mantequilla para reducir costo unitario",
				estimatedCostPerKg: 10800,
				createdAt: new Date("2024-03-05"),
				isActive: true,
				ingredients: [
					{ id: "i_harina", name: "Harina", waterPercentage: 0, pricePerGram: 3.2, quantityGrams: 500 },
					{ id: "i_mantequilla", name: "Mantequilla nacional", waterPercentage: 16, pricePerGram: 14, quantityGrams: 250 },
					{ id: "i_agua", name: "Agua", waterPercentage: 100, pricePerGram: 0.1, quantityGrams: 250 },
					{ id: "i_sal", name: "Sal", waterPercentage: 0, pricePerGram: 1, quantityGrams: 10 },
				],
			},
			{
				versionId: "v3",
				versionName: "V3 — Experimental",
				shortDescription: "Prueba con margarina vegetal + harina integral",
				estimatedCostPerKg: 14200,
				createdAt: new Date("2024-06-20"),
				isActive: true,
				ingredients: [
					{ id: "i_harina_int", name: "Harina integral", waterPercentage: 0, pricePerGram: 5, quantityGrams: 400 },
					{ id: "i_harina", name: "Harina blanca", waterPercentage: 0, pricePerGram: 3.2, quantityGrams: 100 },
					{ id: "i_margarina", name: "Margarina vegetal", waterPercentage: 20, pricePerGram: 18, quantityGrams: 300 },
					{ id: "i_agua", name: "Agua", waterPercentage: 100, pricePerGram: 0.1, quantityGrams: 280 },
					{ id: "i_sal", name: "Sal", waterPercentage: 0, pricePerGram: 1, quantityGrams: 10 },
				],
			},
		],
	},
	{
		id: "sr_002",
		name: "Crema Pastelera",
		versions: [
			{
				versionId: "v1",
				versionName: "V1 — Estándar",
				shortDescription: "Receta tradicional con yemas y maicena",
				estimatedCostPerKg: 8500,
				createdAt: new Date("2024-02-14"),
				isActive: true,
				ingredients: [
					{ id: "i_leche", name: "Leche entera", waterPercentage: 88, pricePerGram: 2, quantityGrams: 500 },
					{ id: "i_azucar", name: "Azúcar", waterPercentage: 0, pricePerGram: 2.5, quantityGrams: 100 },
					{ id: "i_yemas", name: "Yemas", waterPercentage: 50, pricePerGram: 15, quantityGrams: 80 },
					{ id: "i_maicena", name: "Maicena", waterPercentage: 0, pricePerGram: 4, quantityGrams: 40 },
				],
			},
		],
	},
];

export const FINAL_RECIPE_HARDCODED = {
	id: "fr_001",
	name: "Medialuna Premium",
	totalUnits: 60,
	ingredientsCost: 28400,
	currentSubrecipeVersionId: "v1",
	subrecipeId: "sr_001",
};

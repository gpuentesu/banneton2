import { v4 as uuidv4 } from "uuid";
import {
	SandboxSession,
	SandboxMetrics,
	SandboxComparison,
	ComparisonRow,
	MasterRecipe,
	BakingParameters,
	SandboxModification,
	SANDBOX_EXPIRY_MINUTES,
	HYDRATION_MIN_PERCENTAGE,
	HYDRATION_MAX_PERCENTAGE,
} from "../lib/types/sandbox";
import { Ingredient } from "../lib/types/recipe";

export function createSession(masterRecipe: MasterRecipe): SandboxSession {
	return {
		sessionId: uuidv4(),
		masterRecipeId: masterRecipe.id,
		status: "active",
		createdAt: new Date(),
		lastActivityAt: new Date(),
		modifiedIngredients: JSON.parse(JSON.stringify(masterRecipe.ingredients)),
		modifiedBakingParameters: JSON.parse(JSON.stringify(masterRecipe.bakingParameters)),
		modifications: [],
	};
}

export function computeSandboxMetrics(
	ingredients: Ingredient[],
	bakingParameters: BakingParameters,
): SandboxMetrics {
	const totalFlourGrams = ingredients
		.filter((i) => i.waterPercentage === 0)
		.reduce((sum, i) => sum + i.quantityGrams, 0);

	const totalWaterGrams = ingredients
		.filter((i) => i.waterPercentage > 0)
		.reduce((sum, i) => sum + (i.quantityGrams * i.waterPercentage) / 100, 0);

	const totalHydration = totalFlourGrams > 0
		? Math.round((totalWaterGrams / totalFlourGrams) * 100)
		: 0;

	const estimatedTotalCost = ingredients.reduce(
		(sum, i) => sum + i.quantityGrams * i.pricePerGram,
		0,
	);

	const estimatedCostPerUnit = bakingParameters.unitsPerBatch > 0
		? Math.round(estimatedTotalCost / bakingParameters.unitsPerBatch)
		: 0;

	const rangeWarnings = [];
	if (totalHydration < HYDRATION_MIN_PERCENTAGE) {
		rangeWarnings.push({
			field: "totalHydration",
			value: totalHydration,
			message: `Hidratación (${totalHydration}%) está por debajo del mínimo recomendado (${HYDRATION_MIN_PERCENTAGE}%)`,
		});
	}
	if (totalHydration > HYDRATION_MAX_PERCENTAGE) {
		rangeWarnings.push({
			field: "totalHydration",
			value: totalHydration,
			message: `Hidratación (${totalHydration}%) está por encima del máximo recomendado (${HYDRATION_MAX_PERCENTAGE}%)`,
		});
	}

	return { totalHydration, estimatedTotalCost, estimatedCostPerUnit, rangeWarnings };
}

export function compareSessions(
	original: MasterRecipe,
	modified: SandboxSession,
): SandboxComparison {
	const originalMetrics = computeSandboxMetrics(
		original.ingredients,
		original.bakingParameters,
	);
	const modifiedMetrics = computeSandboxMetrics(
		modified.modifiedIngredients,
		modified.modifiedBakingParameters,
	);

	const rows: ComparisonRow[] = [
		{
			label: "Costo total estimado",
			originalValue: `$${originalMetrics.estimatedTotalCost.toLocaleString()}`,
			modifiedValue: `$${modifiedMetrics.estimatedTotalCost.toLocaleString()}`,
			hasChanged: originalMetrics.estimatedTotalCost !== modifiedMetrics.estimatedTotalCost,
		},
		{
			label: "Costo por unidad",
			originalValue: `$${originalMetrics.estimatedCostPerUnit.toLocaleString()}`,
			modifiedValue: `$${modifiedMetrics.estimatedCostPerUnit.toLocaleString()}`,
			hasChanged: originalMetrics.estimatedCostPerUnit !== modifiedMetrics.estimatedCostPerUnit,
		},
		{
			label: "Hidratación total",
			originalValue: `${originalMetrics.totalHydration}%`,
			modifiedValue: `${modifiedMetrics.totalHydration}%`,
			hasChanged: originalMetrics.totalHydration !== modifiedMetrics.totalHydration,
		},
		{
			label: "Tiempo de horneado",
			originalValue: `${original.bakingParameters.bakingTimeHours}h`,
			modifiedValue: `${modified.modifiedBakingParameters.bakingTimeHours}h`,
			hasChanged: original.bakingParameters.bakingTimeHours !== modified.modifiedBakingParameters.bakingTimeHours,
		},
		{
			label: "Unidades por lote",
			originalValue: original.bakingParameters.unitsPerBatch,
			modifiedValue: modified.modifiedBakingParameters.unitsPerBatch,
			hasChanged: original.bakingParameters.unitsPerBatch !== modified.modifiedBakingParameters.unitsPerBatch,
		},
	];

	return { rows, originalMetrics, modifiedMetrics };
}

export function isSessionExpired(session: SandboxSession): boolean {
	const elapsed = Date.now() - session.lastActivityAt.getTime();
	return elapsed > SANDBOX_EXPIRY_MINUTES * 60 * 1000;
}

export function recordModification(
	session: SandboxSession,
	mod: SandboxModification,
): void {
	session.modifications.push(mod);
	session.lastActivityAt = new Date();
}

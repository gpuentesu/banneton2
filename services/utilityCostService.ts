import { UtilityTariffs, RecipeCostSummary, TariffValidationError } from "../domain/types/utilities";
import { DEFAULT_UTILITY_TARIFFS } from "../domain/data/utilities";
import { computeRecipeCost, validateTariffs } from "../utils/utilityCostUtils";
import { MasterRecipe } from "../domain/types/sandbox";

let currentTariffs: UtilityTariffs = structuredClone(DEFAULT_UTILITY_TARIFFS);

export function getTariffs(): UtilityTariffs {
	return structuredClone(currentTariffs);
}

export function updateTariffs(updated: UtilityTariffs): { tariffs?: UtilityTariffs; errors?: TariffValidationError[] } {
	const errors = validateTariffs(updated);
	if (errors.length > 0) {
		return { errors };
	}
	currentTariffs = structuredClone(updated);
	return { tariffs: getTariffs() };
}

export function computeServiceCosts(
	recipe: Pick<MasterRecipe, "ingredients" | "bakingParameters">,
): RecipeCostSummary {
	return computeRecipeCost(currentTariffs, recipe);
}

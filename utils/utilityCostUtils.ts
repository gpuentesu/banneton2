import { UtilityTariffs, UtilityCostBreakdown, RecipeCostSummary, TariffValidationError } from "../lib/types/utilities";
import { MasterRecipe, BakingParameters } from "../lib/types/sandbox";

export const OVEN_USAGE_PERCENTAGE_DEFAULT = 0.85;

export function computeUtilityCosts(
	tariffs: UtilityTariffs,
	bakingParameters: BakingParameters,
): UtilityCostBreakdown {
	const waterCost = (() => {
		const raw = tariffs.water.pricePerLiter * bakingParameters.unitsPerBatch;
		return Math.round(raw * (1 + tariffs.water.additionalUsagePercentage / 100));
	})();

	const gasCost = Math.round(tariffs.gas.pricePerHour * bakingParameters.bakingTimeHours);

	const electricityCost = (() => {
		const raw = tariffs.electricity.pricePerKwh * tariffs.electricity.ovenPowerKw;
		const withTime = raw * bakingParameters.bakingTimeHours * OVEN_USAGE_PERCENTAGE_DEFAULT;
		return Math.round(withTime + tariffs.electricity.fixedSurcharge);
	})();

	const subtotalServicesCost = waterCost + gasCost + electricityCost;

	return {
		waterCost,
		gasCost,
		electricityCost,
		subtotalServicesCost,
	};
}

export function computeRecipeCost(
	tariffs: UtilityTariffs,
	recipe: Pick<MasterRecipe, "ingredients" | "bakingParameters">,
): RecipeCostSummary {
	const ingredientsCost = recipe.ingredients.reduce(
		(sum, i) => sum + i.quantityGrams * i.pricePerGram,
		0,
	);

	const services = computeUtilityCosts(tariffs, recipe.bakingParameters);
	const totalCost = ingredientsCost + services.subtotalServicesCost;
	const costPerUnit = recipe.bakingParameters.unitsPerBatch > 0
		? Math.round(totalCost / recipe.bakingParameters.unitsPerBatch)
		: 0;

	return { ingredientsCost, services, totalCost, costPerUnit };
}

export function validateTariffs(tariffs: UtilityTariffs): TariffValidationError[] {
	const errors: TariffValidationError[] = [];

	if (tariffs.water.pricePerLiter < 0) {
		errors.push({ field: "water.pricePerLiter", message: "El precio del agua no puede ser negativo" });
	}
	if (tariffs.water.additionalUsagePercentage < 0) {
		errors.push({ field: "water.additionalUsagePercentage", message: "El porcentaje adicional no puede ser negativo" });
	}
	if (tariffs.gas.pricePerHour < 0) {
		errors.push({ field: "gas.pricePerHour", message: "El precio del gas no puede ser negativo" });
	}
	if (tariffs.electricity.pricePerKwh < 0) {
		errors.push({ field: "electricity.pricePerKwh", message: "El precio de electricidad no puede ser negativo" });
	}
	if (tariffs.electricity.ovenPowerKw <= 0) {
		errors.push({ field: "electricity.ovenPowerKw", message: "La potencia del horno debe ser mayor a 0" });
	}
	if (tariffs.electricity.fixedSurcharge < 0) {
		errors.push({ field: "electricity.fixedSurcharge", message: "El recargo fijo no puede ser negativo" });
	}

	return errors;
}

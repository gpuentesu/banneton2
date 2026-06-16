export interface WaterTariff {
  pricePerLiter: number
  additionalUsagePercentage: number
}

export interface GasTariff {
  pricePerHour: number
}

export interface ElectricityTariff {
  pricePerKwh: number
  ovenPowerKw: number
  fixedSurcharge: number
}

export interface UtilityTariffs {
  water: WaterTariff
  gas: GasTariff
  electricity: ElectricityTariff
}

export interface UtilityCostBreakdown {
  waterCost: number
  gasCost: number
  electricityCost: number
  subtotalServicesCost: number
}

export interface RecipeCostSummary {
  ingredientsCost: number
  services: UtilityCostBreakdown
  totalCost: number
  costPerUnit: number
}

export interface TariffValidationError {
  field: string
  message: string
}

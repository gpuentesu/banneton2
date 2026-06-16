import { Ingredient } from "./recipe";

export interface SubrecipeVersion {
  versionId: string
  versionName: string
  shortDescription: string
  estimatedCostPerKg: number
  createdAt: Date
  ingredients: Ingredient[]
  isActive: boolean
}

export interface Subrecipe {
  id: string
  name: string
  versions: SubrecipeVersion[]
}

export interface SubrecipeVersionSummary {
  versionId: string
  versionName: string
  shortDescription: string
  estimatedCostPerKg: number
  createdAt: Date
}

export interface VersionSelectionResult {
  previousVersionId: string
  newVersionId: string
  costVariationPercentage: number
  updatedTotalCost: number
  updatedTotalHydration: number
}

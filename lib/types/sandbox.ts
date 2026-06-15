import { Ingredient } from "./recipe";
import { SubrecipeVersion } from "./subrecipe";

export type SandboxStatus = "active" | "expired" | "saved" | "discarded"

export interface RecipeComponent {
  type: "ingredient" | "subrecipe"
  id: string
  name: string
  quantityGrams: number
  selectedVersionId?: string
}

export interface BakingParameters {
  bakingTimeHours: number
  unitsPerBatch: number
}

export interface MasterRecipe {
  id: string
  name: string
  version: string
  components: RecipeComponent[]
  ingredients: Ingredient[]
  subrecipeVersions: SubrecipeVersion[]
  bakingParameters: BakingParameters
}

export interface SandboxModification {
  componentId: string
  field: "quantityGrams" | "selectedVersionId" | "bakingTimeHours" | "unitsPerBatch"
  previousValue: number | string
  newValue: number | string
}

export interface SandboxSession {
  sessionId: string
  masterRecipeId: string
  status: SandboxStatus
  createdAt: Date
  lastActivityAt: Date
  modifiedIngredients: Ingredient[]
  modifiedBakingParameters: BakingParameters
  modifications: SandboxModification[]
}

export interface RangeWarning {
  field: string
  value: number
  message: string
}

export interface SandboxMetrics {
  totalHydration: number
  estimatedTotalCost: number
  estimatedCostPerUnit: number
  rangeWarnings: RangeWarning[]
}

export interface ComparisonRow {
  label: string
  originalValue: string | number
  modifiedValue: string | number
  hasChanged: boolean
}

export interface SandboxComparison {
  rows: ComparisonRow[]
  originalMetrics: SandboxMetrics
  modifiedMetrics: SandboxMetrics
}

export const SANDBOX_EXPIRY_MINUTES = 30;
export const HYDRATION_MIN_PERCENTAGE = 40;
export const HYDRATION_MAX_PERCENTAGE = 90;

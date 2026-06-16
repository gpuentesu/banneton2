export interface Ingredient {
  id: string
  name: string
  waterPercentage: number
  pricePerGram: number
  quantityGrams: number
}

export interface BakerPercentages {
  [ingredientId: string]: number
}

export interface RecipeMetrics {
  totalHydration: number
  estimatedTotalCost: number
  estimatedCostPerUnit: number
  bakerPercentages: BakerPercentages
}

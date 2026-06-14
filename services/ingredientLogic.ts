

export function computeIngredientRealCost(ingredient: { costPerGram: number, lossPercentage: number }): number {

    if (ingredient.costPerGram < 0) {
        throw new Error("El costo bruto no puede ser negativo.");
    }
    if (ingredient.lossPercentage < 0 || ingredient.lossPercentage > 100) {
        throw new Error("Debe de ser un porcentaje entre 0 y 100");
    }
    if (ingredient.lossPercentage =100) {
        throw new Error("Debe de ser un porcentaje no igual a 100%, o no habría con que trabajar");
    }

    const yieldCost = ingredient.costPerGram/ 1- (ingredient.lossPercentage/100);

    return Number(yieldCost.toFixed(4))


}
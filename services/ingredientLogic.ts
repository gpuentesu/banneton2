
export interface CostInput {
    costPerGram: number;
    lossPercentage: number;
}

export interface HydrationInput {
    hydrationPercentage: number;
}

const KILO_GRAMS = 1000;
const COLOMBIAN_POUND_GRAMS = 500;

export function computeIngredientRealCost(input: CostInput): number {
    const { costPerGram, lossPercentage } = input;

    if (costPerGram < 0) {
        throw new Error("The brute cost can't be negative");
    }
    if (lossPercentage < 0 || lossPercentage > 100) {
        throw new Error("It must be a percentage between 0 and 100");
    }
    if (lossPercentage == 100) {
        throw new Error("Must be a percentage lesser than 100 or else there won't be something to work with");
    }

    const yieldProportion =  (1- (lossPercentage/100));
    const yieldCost = costPerGram/yieldProportion

    return Number(yieldCost.toFixed(4))
}


export function computeBruteCostPerPound({ costPerGram}: CostInput): number {

    if (costPerGram < 0) {
        throw new Error("The brute cost can't be negative");
    }

    const costPerPound = costPerGram*COLOMBIAN_POUND_GRAMS;

    return costPerPound
    
}

export function computeBruteCostPerKilo({ costPerGram }: CostInput): number {

    if (costPerGram < 0) {
        throw new Error("The brute cost can't be negative");
    }

    const costPerKilo = costPerGram*KILO_GRAMS;

    return costPerKilo
}

export function computeRealCostPerPound( input: CostInput): number {
    

    const realCost = computeIngredientRealCost(input);
    const realCostPerPound = realCost*COLOMBIAN_POUND_GRAMS;

    return realCostPerPound

}
export function computeRealCostPerKilo( input: CostInput ): number {

    const realCost = computeIngredientRealCost(input);
    const realCostPerKilo = realCost*KILO_GRAMS;

    return realCostPerKilo

}

export function computeHydrationAmount({hydrationPercentage }: HydrationInput): number {

    if (hydrationPercentage < 0 || hydrationPercentage > 100) {
        throw new Error("The hydration percentage must be between 0 and 100");
    }

    const hydrationProportion= hydrationPercentage/100;

    return hydrationProportion
}




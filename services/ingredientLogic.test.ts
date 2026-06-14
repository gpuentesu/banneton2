import{describe, it, expect} from 'vitest';
import{computeIngredientRealCost} from './ingredientLogic';

describe("RF_01: Lógica de Negocio de Ingredientes (Cálculo de Costos con Merma)", () => {

    it("debe de retornar el mismo costo si la merma es 0", () => {
        const realCostIfLossIs0 = computeIngredientRealCost(costPerGram: 100, ingredient.lossPercentage: 0);
        expect(realCostIfLossIs0).toBe(100);
    });
});

import { isCircularyDependent } from "./subrecipeLogic";

export interface ComponentInRecipe{
    componentId: number;
    quantity: number;
}

export interface formulationDetail{
    recipeId: number
    name: string;
    components: ComponentInRecipe[];
}


export function addComponentPercentage(

    recipe: formulationDetail,
    newComponent: ComponentInRecipe,

): formulationDetail{
    
    if(newComponent.quantity<= 0){
        throw new Error("The amount must be greater than 0")
    }

    // valor temporal
    return {recipeId: 1, name: "s", components: [recipe.components[1], newComponent]};
}


export function isExistingComponent(


): boolean{

return false;
}

export function isValidQuantity(


): boolean{

return false;
}


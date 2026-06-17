import { isCircularyDependent } from "./subrecipeLogic";

export interface ComponentInRecipe{
    componentId: number;
    quantity: number;
}

export interface Recipe{
    recipeId: number
    name: string;
    components: ComponentInRecipe[];
}


export function addComponentPercentage(

    recipeToChange: Recipe
,
    newComponent: ComponentInRecipe,

): Recipe{
    
    if(newComponent.quantity<= 0){
        throw new Error("The amount must be greater than 0")
    }


    const exists = recipeToChange.components.find(c => c.componentId === newComponent.componentId); 
    if (exists){
        throw new Error("The component already exists in this recipe");
    }


    const circularDependencyExists = isCircularyDependent(recipeToChange.recipeId, newComponent.componentId, ...recipeToChange.components)
    if(circularDependencyExists){
        throw new Error("Circular dependency detected")
    }
    return{
        ...recipeToChange,
        components: [...recipeToChange.components, newComponent]
        //Doesnt this return a list with all the components except the new one and then the lsit with the new one? isn't this redundancy?
    }
    // valor temporal
    return {recipeId: 1, name: "s", components: [...recipeToChange.components, newComponent]};
}

// me confunde el retorno de añadir un componente, acaso devuelve una receta, que son IDs, nombre, y su arreglo de relaciones? y luego devuelve lo anterior pero desde la perspectiva del neuvo componente?
export function isExistingComponent(


): boolean{

return false;
}

export function isValidQuantity(


): boolean{

return false;
}


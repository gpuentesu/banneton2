import { isCircularyDependent, RecipeRelation } from "./subrecipeLogic";

export type MeasurementUnit = "percentage" | "grams";

export interface ComponentInRecipe{
    componentId: number;
    quantity: number;
    unit: MeasurementUnit;
}

export interface Recipe{
    recipeId: number;
    name: string;
    unitWeight: number;
    batchUnits: number;
    batchOvenTime?: number
    realWeight?: number;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    components: ComponentInRecipe[];

    totalFatPercentage: number;
    totalHydrationPercentage: number;
    costPerUnit: number;
}

function validateQuantity(

	quantity: number,
	unit: MeasurementUnit

): void{
	if(quantity<= 0){
		throw new Error("The amount must be greater than 0");
	}
	if(unit === "percentage" && quantity >100){
		throw new Error("The percentage cannot be greater than 100");
	}

}

export function createRecipe(

	id: number,
	name: string,
	unitWeight: number,
	batchUnits: number,
	creatorId: string,
	realWeight?: number

): Recipe {

	if (!name.trim()) {throw new Error("Recipe name cannot be empty");}
	if (unitWeight <= 0) {throw new Error("Unit weight must be greater than 0");}
	if (batchUnits <= 0) {throw new Error("Batch units must be greater than 0");}
	if (realWeight !== undefined && realWeight <= 0) {
		throw new Error("Real weight must be greater than 0 if provided");
	}

	return{
		recipeId: id,
		name,
		unitWeight,
		batchUnits,
		realWeight, 
		creatorId,
		createdAt: new Date(),
		updatedAt: new Date(),
		components: [], 
		totalFatPercentage: 0,
		totalHydrationPercentage: 0,
		costPerUnit: 0
	};

}


export function addComponent(

	recipeToChange: Recipe,
	newComponent: ComponentInRecipe,
	allExistingRelationships: RecipeRelation[]

): Recipe{
    
	validateQuantity(newComponent.quantity, newComponent.unit);



	const exists = recipeToChange.components.find(c => c.componentId === newComponent.componentId); 
	if (exists){
		throw new Error("The component already exists in this recipe");
	}


	const circularDependencyExists = isCircularyDependent(recipeToChange.recipeId, newComponent.componentId, allExistingRelationships);
	if(circularDependencyExists){
		throw new Error("Circular dependency detected");
	}

    
	return{
		...recipeToChange,
		components: [...recipeToChange.components, newComponent]
	};
}


export function removeComponent(

	componentIdToEliminate: number,
	recipeToChange: Recipe

): Recipe{

	const exists = recipeToChange.components.some(c=> c.componentId ===componentIdToEliminate);
	if(!exists){
		throw new Error("The component to eliminate doesn't exist in this recipe");
	}


	return{
		...recipeToChange,
		components: recipeToChange.components.filter(c=> c.componentId !==componentIdToEliminate)

	};
}

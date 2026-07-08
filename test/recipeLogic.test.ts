import { describe, test, expect } from "vitest";
import { createRecipe, addComponent, removeComponent, ComponentInRecipe } from "../domain/recipeLogic";
import { create } from "domain";
import { RecipeRelation } from "@/domain/subrecipeLogic";

describe("Recipe Logic functions - RF_03", () => {
    
	describe("1. createRecipe", () => {
    
        
		test("should create a valid recipe with standard whole numbers", () => {
			const recipe = createRecipe(1, "Baguette", 500, 10, "user-123");
			expect(recipe.name).toBe("Baguette");
			expect(recipe.components).toEqual([]); // Nace vacío
		});

		test("should allow decimal numbers for weights and batches", () => {
			const recipe = createRecipe(2, "Croissant", 60.5, 2.5, "user-123");
			expect(recipe.unitWeight).toBe(60.5);
		});

		test("should allow names with numbers and symbols", () => {
			const recipe = createRecipe(3, "Pan de Bono #2!", 100, 5, "user-123");
			expect(recipe.name).toBe("Pan de Bono #2!");
		});

		// Bad Paths
		test("should throw an error if the name is empty or just spaces", () => {
			expect(() => createRecipe(1, "   ", 500, 10, "user-123")).toThrow("Recipe name cannot be empty");
		});

		test("should throw an error if weight or batches are negative or zero", () => {
			expect(() => createRecipe(1, "Bread", -10, 10, "user-123")).toThrow("Unit weight must be greater than 0");
			expect(() => createRecipe(1, "Bread", 500, 0, "user-123")).toThrow("Batch units must be greater than 0");
		});
	});
    

	describe("2. addComponent", () => {
		test("should successfully add a new valid component to the recipe", () => {
			const baseRecipe = createRecipe(1, "Pan Base", 500, 1, "user-123");
			const newComponent: ComponentInRecipe = { componentId: 2, quantity: 60, unit: "percentage" };
			const relations: RecipeRelation[] = [];

			const updatedRecipe = addComponent(baseRecipe, newComponent, relations);

			expect(updatedRecipe.components).toHaveLength(1);
			expect(updatedRecipe.components[0]).toEqual(newComponent);
		});

		test("should throw an error if the component already exists in the recipe", () => {
			const baseRecipe = createRecipe(1, "Pan Base", 500, 1, "user-123");
			// Simulamos que ya tiene el ingrediente con ID 2
			baseRecipe.components.push({ componentId: 2, quantity: 50, unit: "grams" });
            
			const duplicateComponent: ComponentInRecipe = { componentId: 2, quantity: 10, unit: "grams" };

			expect(() => addComponent(baseRecipe, duplicateComponent, [])).toThrow("The component already exists in this recipe");
		});
    
		test("should throw an error if there is circular dependency", () => {
            
			const baseRecipe = createRecipe(1, "Masa Madre", 1000, 1, "user-123");

			const invalidComponent: ComponentInRecipe ={
				componentId: 1,
				quantity: 10,
				unit: "percentage"
			};
            
			const currentGraphRelations: RecipeRelation[] = [];
			expect(() => addComponent(baseRecipe, invalidComponent, currentGraphRelations)).toThrow("Circular dependency detected");
  
		});

		test("should throw an error if validation for percentage limits fails (>100)", () => {
			const baseRecipe = createRecipe(1, "Pan", 500, 1, "user-123");
			const invalidComponent: ComponentInRecipe = { componentId: 2, quantity: 150, unit: "percentage" };

			expect(() => addComponent(baseRecipe, invalidComponent, [])).toThrow("The percentage cannot be greater than 100");
		});

		test("should throw an error on INDIRECT circular dependency (A -> B -> A)", () => {
			const recipeA = createRecipe(1, "Receta A", 500, 1, "user-123");
			const componentB: ComponentInRecipe = { componentId: 2, quantity: 20, unit: "percentage" };

			const globalRelations: RecipeRelation[] = [
				{ parentId: 2, childId: 1 } 
			];

			expect(() => addComponent(recipeA, componentB, globalRelations)).toThrow("Circular dependency detected");
		});
	});

	describe("3. removeComponent", () => {

		test("should successfully remove an existing component from the recipe", () => {
			const baseRecipe = createRecipe(1, "Pan Dulce", 500, 1, "user-123");
			baseRecipe.components.push({ componentId: 5, quantity: 100, unit: "grams" });

			const updatedRecipe = removeComponent(5, baseRecipe);

			expect(updatedRecipe.components).toHaveLength(0);
		});

		test("should throw an error if trying to remove a non-existent component", () => {
			const baseRecipe = createRecipe(1, "Pan Dulce", 500, 1, "user-123");
            
			expect(() => removeComponent(999, baseRecipe)).toThrow("The component to eliminate doesn't exist in this recipe");
		});
	});

});

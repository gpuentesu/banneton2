import { describe, it, expect } from "vitest";
import { calcFinalOvenTime, type SetData } from "../lib/portionCalcLogic";

describe("Oven Calculator Logistics - Unit Tests", () => {

	it("Happy Path", () => {
		const mockData: SetData = {
			units: 10,
			unitsPerSet: 10,
			ovenTime: 30,       
			handlingTime: 5,     
			ovenNumber: 1
		};

		const result = calcFinalOvenTime(mockData);

		expect(result.setNumber).toBe(1);
		expect(result.totalTimeOven).toBe(30);
		expect(result.totalHandlingTime).toBe(5);
		expect(result.finalTimeMinutes).toBe(35); 
	}); // <-- Aquí se cierra el 'it' del camino feliz

	it("debería manejar múltiples sets distribuidos en varios hornos", () => {
		const mockData: SetData = {
			units: 40,
			unitsPerSet: 10,
			ovenTime: 60,
			handlingTime: 10,
			ovenNumber: 2
		};

		const result = calcFinalOvenTime(mockData);

		expect(result.setNumber).toBe(2);
		expect(result.totalTimeOven).toBe(120); 
		expect(result.totalHandlingTime).toBe(40); 
		expect(result.finalTimeMinutes).toBe(160); 
	}); 

	it("debería retornar 1 set si las unidades son menores que la capacidad por set", () => {
		const mockData: SetData = {
			units: 3, 
			unitsPerSet: 12,
			ovenTime: 45,
			handlingTime: 8,
			ovenNumber: 1
		};

		const result = calcFinalOvenTime(mockData);

		expect(result.setNumber).toBe(1);
		expect(result.finalTimeMinutes).toBe(53); 
	}); 

});

describe("Oven Calculator", () => {

	it("debería manejar de forma segura 0 unidades a procesar", () => {
		const mockData: SetData = {
			units: 0,
			unitsPerSet: 10,
			ovenTime: 30,
			handlingTime: 5,
			ovenNumber: 1
		};

		const result = calcFinalOvenTime(mockData);
		expect(result.setNumber).toBe(0);
		expect(result.finalTimeMinutes).toBe(0);
	});

	it("debería lanzar un error si unidades por set es 0 (Evitar división por cero)", () => {
		const mockData: SetData = {
			units: 20,
			unitsPerSet: 0, 
			ovenTime: 30,
			handlingTime: 5,
			ovenNumber: 1
		};
		expect(() => calcFinalOvenTime(mockData)).toThrowError(
			"La capacidad por set y el número de hornos deben ser mayores a cero."
		);
	});

});

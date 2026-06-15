import { describe, it, expect } from "vitest";
import { 
	calclNumberOfSets, 
	calcTimeInOven, 
	CalcHandlingTime, 
	calcFinalOvenTime,
	SetData
} from "../lib/portionCalcLogic"; 
describe("Funciones de Estimación de Tiempos de Horno", () => {

	describe("calclNumberOfSets", () => {
		it("debería calcular correctamente los sets necesarios para un flujo normal", () => {
			expect(calclNumberOfSets(50, 10, 2)).toBe(3);
		});

		it("debería retornar 1 si las unidades son menores o iguales a la capacidad por set", () => {
			expect(calclNumberOfSets(5, 10, 1)).toBe(1);
			expect(calclNumberOfSets(10, 10, 1)).toBe(1);
		});

		it("debería retornar 0 si las unidades son 0 (caso límite)", () => {
			expect(calclNumberOfSets(0, 10, 2)).toBe(0);
		});

		it("debería lanzar un error si la capacidad por set o los hornos son menores o iguales a 0", () => {
			expect(() => calclNumberOfSets(10, 0, 2)).toThrow();
			expect(() => calclNumberOfSets(10, 10, 0)).toThrow();
			expect(() => calclNumberOfSets(10, -5, 2)).toThrow();
		});
	});

	describe("calcTimeInOven", () => {
		it("debería calcular el tiempo total multiplicando sets por tiempo de horno", () => {
			expect(calcTimeInOven(3, 45)).toBe(135);
		});


		it("debería retornar 0 si los sets son 0", () => {
			expect(calcTimeInOven(0, 45)).toBe(0);
		});

		it("debería lanzar un error si el tiempo de horno es negativo", () => {
			expect(() => calcTimeInOven(2, -10)).toThrow();
		});
	});

	describe("CalcHandlingTime", () => {
		it("debería calcular el tiempo de manejo multiplicando por sets y hornos si sets > 1", () => {
			expect(CalcHandlingTime(5, 3, 2)).toBe(30);
		});

		it("debería retornar exactamente el handlingTime si solo hay 1 set (caso límite)", () => {
			expect(CalcHandlingTime(5, 1, 4)).toBe(5);
		});

		it("debería retornar 0 si los sets son 0", () => {
			expect(CalcHandlingTime(5, 0, 2)).toBe(0);
		});

		it("debería lanzar un error si el tiempo de manejo es negativo", () => {
			expect(() => CalcHandlingTime(-5, 2, 2)).toThrow();
		});
	});

	describe("calcFinalOvenTime (Orquestadora)", () => {
        
		it("Happy path: calcula la estimación completa con datos estándar", () => {
			const datos: SetData = {
				units: 50,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};

			const resultado = calcFinalOvenTime(datos);
			expect(resultado.setNumber).toBe(3);
			expect(resultado.totalTimeOven).toBe(90);
			expect(resultado.totalHandlingTime).toBe(30);
			expect(resultado.finalTimeMinutes).toBe(120);
		});


		it("Caso límite: cuando hay MENOS unidades que la capacidad de la tanda (1 solo horno)", () => {
			const datos: SetData = {
				units: 5,         
				unitsPerSet: 10,
				ovenTime: 60,
				handlingTime: 10,
				ovenNumber: 1
			};

			const resultado = calcFinalOvenTime(datos);
			expect(resultado.setNumber).toBe(1);
			expect(resultado.totalTimeOven).toBe(60);
			expect(resultado.totalHandlingTime).toBe(10);
			expect(resultado.finalTimeMinutes).toBe(70);
		});

		it("Caso límite: cuando hay MÁS unidades que la capacidad de la tanda utilizando VARIOS hornos", () => {
			const datos: SetData = {
				units: 35,        
				unitsPerSet: 10,
				ovenTime: 40,
				handlingTime: 5,
				ovenNumber: 3     
			};

			const resultado = calcFinalOvenTime(datos);
			expect(resultado.setNumber).toBe(2);
			expect(resultado.totalTimeOven).toBe(80);
			expect(resultado.totalHandlingTime).toBe(30);
			expect(resultado.finalTimeMinutes).toBe(110);
		});

		it("Caso límite global: cuando las unidades son 0", () => {
			const datos: SetData = {
				units: 0,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};
			const resultado = calcFinalOvenTime(datos);
			expect(resultado.finalTimeMinutes).toBe(0);
			expect(resultado.setNumber).toBe(0);
			expect(resultado.totalTimeOven).toBe(0);
			expect(resultado.totalHandlingTime).toBe(0);
		});

		it("debería lanzar un error si algún parámetro de negocio es negativo", () => {
			const datosInvalidos: SetData = {
				units: 10,
				unitsPerSet: -5, // Inválido
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};
			expect(() => calcFinalOvenTime(datosInvalidos)).toThrow();
		});
	});
});

import { describe, test, expect } from "vitest";
import { calcFinalOvenTime, calcTimeInOven, CalcHandlingTime, calclNumberOfSets, type SetData } from "../lib/portionCalcLogic";


describe("Pruebas unitarias: calclNumberOfSets", () => {
	describe("Camino Correcto", () => {
		test("Cálculo con unidades mayores a la capacidad de un set", () => {
			expect(calclNumberOfSets(50, 10, 2)).toBe(3);
		});
	});

	describe("Casos Límite", () => {
		test("Unidades exactamente en cero", () => {
			expect(calclNumberOfSets(0, 10, 1)).toBe(0);
		});

		test("Unidades menores a cero", () => {
			expect(calclNumberOfSets(-5, 10, 1)).toBe(0);
		});

		test("Unidades exactamente iguales a la capacidad del set", () => {
			expect(calclNumberOfSets(10, 10, 1)).toBe(1);
		});
	});

	describe("Casos de Fallo", () => {
		test("Capacidad por set en cero", () => {
			expect(() => calclNumberOfSets(10, 0, 1)).toThrow("La capacidad por set y el número de hornos deben ser mayores a cero.");
		});

		test("Número de hornos en cero", () => {
			expect(() => calclNumberOfSets(10, 5, 0)).toThrow("La capacidad por set y el número de hornos deben ser mayores a cero.");
		});

		test("Capacidad por set negativa", () => {
			expect(() => calclNumberOfSets(10, -5, 1)).toThrow("La capacidad por set y el número de hornos deben ser mayores a cero.");
		});

		test("Número de hornos negativo", () => {
			expect(() => calclNumberOfSets(10, 5, -1)).toThrow("La capacidad por set y el número de hornos deben ser mayores a cero.");
		});
	});

	describe("Camino Diferente al Correcto", () => {
		test("Unidades menores a la capacidad del set pero con múltiples hornos", () => {
			expect(calclNumberOfSets(5, 10, 3)).toBe(1);
		});
	});
});

describe("Pruebas unitarias: calcTimeInOven", () => {
	describe("Camino Correcto", () => {
		test("Multiplicación estándar de sets y tiempo", () => {
			expect(calcTimeInOven(3, 30)).toBe(90);
		});
	});

	describe("Casos Límite", () => {
		test("Cero sets", () => {
			expect(calcTimeInOven(0, 30)).toBe(0);
		});

		test("Tiempo de horno en cero", () => {
			expect(calcTimeInOven(3, 0)).toBe(0);
		});
	});

	describe("Casos de Fallo", () => {
		test("Sets negativos", () => {
			expect(calcTimeInOven(-2, 30)).toBe(-60);
		});
	});

	describe("Camino Diferente al Correcto", () => {
		test("Un solo set con tiempo decimal", () => {
			expect(calcTimeInOven(1, 1.5)).toBe(1.5);
		});
	});
});

describe("Pruebas unitarias: CalcHandlingTime", () => {
	describe("Camino Correcto", () => {
		test("Múltiples sets y hornos", () => {
			expect(CalcHandlingTime(5, 3, 2)).toBe(30);
		});
	});

	describe("Casos Límite", () => {
		test("Exactamente un set", () => {
			expect(CalcHandlingTime(5, 1, 4)).toBe(5);
		});

		test("Tiempo de maniobra en cero con múltiples sets", () => {
			expect(CalcHandlingTime(0, 2, 2)).toBe(0);
		});
	});

	describe("Casos de Fallo", () => {
		test("Sets en cero", () => {
			expect(CalcHandlingTime(5, 0, 2)).toBe(0);
		});
	});

	describe("Camino Diferente al Correcto", () => {
		test("Un solo set con número de hornos en cero", () => {
			expect(CalcHandlingTime(5, 1, 0)).toBe(5);
		});
	});
});

describe("Pruebas de integración: calcFinalOvenTime", () => {
	describe("Camino Correcto", () => {
		test("Integración con datos válidos y múltiples sets", () => {
			const datos: SetData = {
				units: 50,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 2
			};
			expect(calcFinalOvenTime(datos)).toEqual({
				finalTimeMinutes: 120,
				setNumber: 3,
				totalTimeOven: 90,
				totalHandlingTime: 30
			});
		});
	});

	describe("Casos Límite", () => {
		test("Estructura completa con unidades en cero", () => {
			const datos: SetData = {
				units: 0,
				unitsPerSet: 10,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 1
			};
			expect(calcFinalOvenTime(datos)).toEqual({
				finalTimeMinutes: 0,
				setNumber: 0,
				totalTimeOven: 0,
				totalHandlingTime: 0
			});
		});
	});

	describe("Casos de Fallo", () => {
		test("Propagación de error por parámetros inválidos", () => {
			const datos: SetData = {
				units: 10,
				unitsPerSet: 0,
				ovenTime: 30,
				handlingTime: 5,
				ovenNumber: 1
			};
			expect(() => calcFinalOvenTime(datos)).toThrow();
		});
	});

	describe("Camino Diferente al Correcto", () => {
		test("Producción mínima que activa la condición de un solo set", () => {
			const datos: SetData = {
				units: 2,
				unitsPerSet: 10,
				ovenTime: 15,
				handlingTime: 10,
				ovenNumber: 5
			};
			expect(calcFinalOvenTime(datos)).toEqual({
				finalTimeMinutes: 25,
				setNumber: 1,
				totalTimeOven: 15,
				totalHandlingTime: 10
			});
		});
	});
});

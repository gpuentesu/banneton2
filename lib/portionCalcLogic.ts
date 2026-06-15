export interface SetData {
    units: number;
    unitsPerSet: number;
    ovenTime: number;
    handlingTime: number;
    ovenNumber: number;
}

export interface FinalEstimation {
    finalTimeMinutes: number;
    setNumber: number;
    totalTimeOven: number;
    totalHandlingTime: number;
}

export function calclNumberOfSets(units: number, unitsPerSet: number, ovenNumber: number): number {
	if (unitsPerSet <= 0 || ovenNumber <= 0) {
		throw new Error("La capacidad por set y el número de hornos deben ser mayores a cero.");
	}
    
	if (units <= 0) {return 0;} 
	if (units <= unitsPerSet) {return 1;}
    
	return Math.ceil(units / (unitsPerSet * ovenNumber));
}

export function calcTimeInOven(sets: number, ovenTime: number): number {
	if (ovenTime < 0) {throw new Error("El tiempo en el horno no puede ser negativo.");}
	if (sets === 0) {return 0;}
    
	return sets * ovenTime;
}

export function CalcHandlingTime(handlingTime: number, sets: number, ovenNumber: number): number {
	if (handlingTime < 0) {throw new Error("El tiempo de manejo no puede ser negativo.");}
	if (sets === 0) {return 0;}
	if (sets === 1) {return handlingTime;}
    
	return handlingTime * sets * ovenNumber;
}

export function calcFinalOvenTime(datos: SetData): FinalEstimation {
	const { units, unitsPerSet, ovenTime, handlingTime, ovenNumber } = datos;

	if (units < 0 || unitsPerSet < 0 || ovenTime < 0 || handlingTime < 0 || ovenNumber < 0) {
		throw new Error("No se permiten valores negativos en los datos de estimación.");
	}

	if (units === 0) {
		return { finalTimeMinutes: 0, setNumber: 0, totalTimeOven: 0, totalHandlingTime: 0 };
	}
	
	const setNumber = calclNumberOfSets(units, unitsPerSet, ovenNumber);
	const ovenTotalTime = calcTimeInOven(setNumber, ovenTime);
	const totalHandlingTime = CalcHandlingTime(handlingTime, setNumber, ovenNumber);
	const tiempoFinalMinutos = ovenTotalTime + totalHandlingTime;

	return {
		finalTimeMinutes: tiempoFinalMinutos,
		setNumber: setNumber,
		totalTimeOven: ovenTotalTime,
		totalHandlingTime: totalHandlingTime
	};
}

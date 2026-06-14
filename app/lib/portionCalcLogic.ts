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


function calclNumberOfSets(units: number, unitsPerSet: number, oveNumber : number): number {
	if (units <= unitsPerSet) {
		return 1;
	}
	return Math.ceil(units / (unitsPerSet * oveNumber));
}

function calcTimeInOven(sets: number, ovenTime: number): number {
	return sets * ovenTime;
}

function CalcHandlingTime(tiempoDeManiobra: number, sets: number, oveNumber: number): number {
	if (sets == 1){
		return tiempoDeManiobra;
	}
	return tiempoDeManiobra * sets * oveNumber;
}

export function calcFinalOvenTime(datos: SetData): FinalEstimation {
	const { units: units, unitsPerSet: unitsPerSet, ovenTime: ovenTime, handlingTime: tiempoDeManiobra, ovenNumber: oveNumber } = datos;

	const setNumber = calclNumberOfSets(units, unitsPerSet, oveNumber);
	const ovenTotalTime = calcTimeInOven(setNumber, ovenTime);
	const totalHadlingTime = CalcHandlingTime(tiempoDeManiobra, setNumber, oveNumber);
	const tiempoFinalMinutos = ovenTotalTime + totalHadlingTime;

	return {
		finalTimeMinutes: tiempoFinalMinutos,
		setNumber: setNumber,
		totalTimeOven: ovenTotalTime,
		totalHandlingTime: totalHadlingTime
	};
}

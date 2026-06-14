export interface DatosHorneado {
    unidades: number;
    unidadesPorTanda: number;
    tiempoDeHorneado: number;
    tiempoDeManiobra: number;
    numeroDeHornos: number;
}

export interface ResultadoEstimacion {
  tiempoFinalMinutos: number;
  numeroDeTandas: number;
  tiempoTotalEnHorno: number;
  tiempoTotalDeManiobra: number;
}

function calcularNumeroDeTandas(unidades: number, unidadesPorTanda: number, numeroDeHornos : number): number {
    if (unidades <= unidadesPorTanda) {
        return 1
    }
    return unidades / (unidadesPorTanda * numeroDeHornos);
}

function calcularTiempoEnHorno(tandas: number, tiempoDeHorneado: number): number {
    return tandas * tiempoDeHorneado;
}

function calculartiempoDeManiobra(tiempoDeManiobra: number, tandas: number, numeroDeHornos: number): number {
    if (tandas == 1){
        return tiempoDeManiobra
    }
    return tiempoDeManiobra * tandas * numeroDeHornos;
}

export function calcularTiempoFinalDeHorneado(datos: DatosHorneado): ResultadoEstimacion {
    const { unidades, unidadesPorTanda, tiempoDeHorneado, tiempoDeManiobra, numeroDeHornos } = datos;

    const numeroDeTandas = calcularNumeroDeTandas(unidades, unidadesPorTanda, numeroDeHornos);
    const tiempoTotalEnHorno = calcularTiempoEnHorno(numeroDeTandas, tiempoDeHorneado);
    const tiempoTotalDeManiobra = calculartiempoDeManiobra(tiempoDeManiobra, numeroDeTandas, numeroDeHornos);
    const tiempoFinalMinutos = tiempoTotalEnHorno + tiempoTotalDeManiobra

    return {
        tiempoFinalMinutos,
        numeroDeTandas,
        tiempoTotalEnHorno,
        tiempoTotalDeManiobra
    }
}

const resultado : ResultadoEstimacion = calcularTiempoFinalDeHorneado({
    unidades: 100,
    unidadesPorTanda: 50,
    tiempoDeHorneado: 20,
    tiempoDeManiobra: 10,
    numeroDeHornos: 2,
});

console.log("Tiempo:", resultado.tiempoFinalMinutos);
console.log("Numero de tandas:", resultado.numeroDeTandas);
console.log("Tiempo de maniobra:", resultado.tiempoTotalDeManiobra)
console.log("tiempo en el horno", resultado.tiempoTotalEnHorno)
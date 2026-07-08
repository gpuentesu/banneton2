import { obtenerRecetaEscalada } from "../services/scaleService";

async function ejecutarTestDeIntegracion() {
	console.log("📡 Conectando a PostgreSQL local en Docker...");
	
	try {
		const idRecetaPrueba = 5; // El ID de la receta que guardamos con SQLTools
		const pesoObjetivo = 5000;  // El peso total que digitó el usuario (5 Kilos)

		console.log(`\n🔄 Solicitando escalado a scaleService para Receta ID: ${idRecetaPrueba} -> Objetivo: ${pesoObjetivo}g...`);
		
		const resultado = await obtenerRecetaEscalada(idRecetaPrueba, pesoObjetivo);

		console.log("\n✅ ¡Cálculo relacional exitoso desde la base de datos!");
		console.log(`Receta ID: ${resultado.idComponente}`);
		console.log(`Peso total de masa entregado: ${resultado.pesoTotalObjetivo}g\n`);
		
		// Muestra la tabla final en la terminal de forma ultra legible
		console.table(resultado.ingredientes);

	} catch (error) {
		console.error("❌ Error crítico durante la ejecución del test:", error);
	}
}

ejecutarTestDeIntegracion();

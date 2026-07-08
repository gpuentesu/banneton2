// services/environment/RegisterEnvironmentParameters.usecase.ts
// RF_08 — Registrar variables geográficas y ambientales
import { parametro_ambiental } from "@prisma/client";
import { prisma } from "@/domain/prisma";
import { validateEnvironmentParameters } from "@/domain/environmentLogic";
import {
	EnvironmentValidationError,
	RegisterEnvironmentCommand,
} from "@/domain/types/environment";

export interface RegisterEnvironmentResult {
	parameters?: parametro_ambiental;
	errors?: EnvironmentValidationError[];
}

export class RegisterEnvironmentParametersUseCase {
	async execute(command: RegisterEnvironmentCommand): Promise<RegisterEnvironmentResult> {
		// --- DOMAIN LOGIC: validación de rangos (paso 4 del flujo normal) ---
		const errors = validateEnvironmentParameters(command);
		if (errors.length > 0) {
			return { errors };
		}

		try {
			const created = await prisma.parametro_ambiental.create({
				data: {
					humedad_relativa: command.humedadRelativa,
					temperatura_ambiente: command.temperaturaAmbiente,
					altitud: command.altitud,
					presion_barometrica: command.presionBarometrica,
					ciudad_referencia: command.ciudadReferencia?.trim() || null,
					sincronizacion_automatica: command.sincronizacionAutomatica ?? false,
					creado_por: command.idCreadoPor ?? null,
				},
			});

			return { parameters: created };
		} catch (error) {
			console.error("Database error while registering environment parameters:", error);
			throw new Error("No se pudieron guardar las variables ambientales en la base de datos.");
		}
	}
}

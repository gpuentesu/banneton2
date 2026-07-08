// services/environment/GetEnvironmentParameters.usecase.ts
// RF_08 — Devuelve el perfil ambiental más reciente para precargar el
// formulario y para el recálculo de recetas (postcondición de RF_08).
import { prisma } from "@/domain/prisma";

export class GetEnvironmentParametersUseCase {
	async execute() {
		return prisma.parametro_ambiental.findFirst({
			orderBy: [{ creado_en: "desc" }, { id_parametro: "desc" }],
		});
	}
}

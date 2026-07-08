// services/report/RegisterProductionReport.usecase.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/domain/prisma";
import { validateProductionReport } from "@/domain/reportLogic";
import { formatLoteIdentifier, parseDateOnly, parseTimeOfDay } from "@/utils/reportUtils";
import {
	ProductionReportValidationError,
	RegisterProductionReportCommand,
} from "@/domain/types/report";
import { PRODUCTION_REPORT_INCLUDE, ProductionReportWithRelations } from "./productionReportInclude";

export interface RegisterProductionReportResult {
	report?: ProductionReportWithRelations;
	errors?: ProductionReportValidationError[];
}

export class RegisterProductionReportUseCase {
	// El async function que ejecuta la acción
	async execute(command: RegisterProductionReportCommand): Promise<RegisterProductionReportResult> {
		// --- DOMAIN LOGIC: validación de campos obligatorios (paso 4 del flujo normal) ---
		const errors = validateProductionReport(command);
		if (errors.length > 0) {
			return { errors };
		}

		// --- INFRASTRUCTURE LOGIC: verificar que exista la receta activa (precondición) ---
		const recipe = await prisma.receta_subreceta.findUnique({
			where: { id_componente: command.idReceta },
		});
		if (!recipe) {
			return { errors: [{ field: "idReceta", message: "La receta activa no existe o fue eliminada" }] };
		}

		const responsable = await prisma.usuario.findUnique({ where: { id_usuario: command.idResponsable } });
		if (!responsable) {
			return { errors: [{ field: "idResponsable", message: "El personal responsable seleccionado no existe" }] };
		}

		if (command.idSupervisor) {
			const supervisor = await prisma.usuario.findUnique({ where: { id_usuario: command.idSupervisor } });
			if (!supervisor) {
				return { errors: [{ field: "idSupervisor", message: "El supervisor seleccionado no existe" }] };
			}
		}

		const identificadorLote = command.identificadorLote?.trim() || (await this.generateLoteIdentifier());

		try {
			const created = await prisma.reporte_produccion.create({
				data: {
					id_receta: command.idReceta,
					identificador_lote: identificadorLote,
					fecha_produccion: parseDateOnly(command.fechaProduccion),
					hora_produccion: parseTimeOfDay(command.horaProduccion),
					cantidad_producida: command.cantidadProducida,
					unidad_medida: command.unidadMedida,
					id_responsable: command.idResponsable,
					id_supervisor: command.idSupervisor ?? null,
					observaciones: command.observaciones ?? null,
					creado_por: command.idCreadoPor ?? null,
					tanda_produccion:
						command.tandas && command.tandas.length > 0
							? {
									create: command.tandas.map((tanda) => ({
										numero_tanda: tanda.numeroTanda,
										cantidad: tanda.cantidad,
									})),
								}
							: undefined,
				},
				include: PRODUCTION_REPORT_INCLUDE,
			});

			return { report: created };
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
				return {
					errors: [{ field: "identificadorLote", message: `El identificador de lote "${identificadorLote}" ya existe` }],
				};
			}
			console.error("Database error while registering production report:", error);
			throw new Error("No se pudo guardar el reporte de producción en la base de datos.");
		}
	}

	/**
	 * Genera el siguiente identificador de lote disponible para el año en
	 * curso, con el formato PREFIJO-AÑO-SECUENCIA (ej. "BNN-2025-0047").
	 */
	private async generateLoteIdentifier(): Promise<string> {
		const now = new Date();
		const yearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));
		const yearEnd = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));

		const count = await prisma.reporte_produccion.count({
			where: { fecha_produccion: { gte: yearStart, lt: yearEnd } },
		});

		return formatLoteIdentifier(count + 1, now);
	}
}

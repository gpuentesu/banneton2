// domain/types/report.ts
// RF_16 — Generar reporte de producción

export type ProductionUnit = "unidades" | "kg";

export interface ProductionBatchInput {
  numeroTanda: number;
  cantidad: number;
}

export interface RegisterProductionReportCommand {
  idReceta: number;
  identificadorLote?: string;
  fechaProduccion: string; // formato "YYYY-MM-DD"
  horaProduccion: string; // formato "HH:mm"
  cantidadProducida: number;
  unidadMedida: ProductionUnit;
  idResponsable: number;
  idSupervisor?: number;
  observaciones?: string;
  idCreadoPor?: number;
  tandas?: ProductionBatchInput[];
}

export interface ProductionReportValidationError {
  field: string;
  message: string;
}

export const PRODUCTION_UNITS: ProductionUnit[] = ["unidades", "kg"];

// domain/types/workshop.ts
// RF_15 — Verificar ingredientes y pasos de elaboración (Modo Taller)

export type WorkshopItemType = "ingrediente" | "paso";

export const WORKSHOP_ITEM_TYPES: WorkshopItemType[] = ["ingrediente", "paso"];

export type WorkshopSessionState = "en_progreso" | "completada";

export interface WorkshopIngredientInput {
  descripcion: string;
  cantidad?: number;
  unidadMedida?: string;
}

export interface CreateWorkshopSessionCommand {
  idReceta: number;
  identificadorLote?: string;
  idCreadoPor?: number;
  // Opcionales: si no se envían, los ingredientes se derivan de la
  // formulación de la receta (RF_03/RF_06).
  ingredientes?: WorkshopIngredientInput[];
  pasos?: string[];
}

// Ítem ya normalizado y ordenado, listo para persistir.
export interface WorkshopChecklistItem {
  tipo: WorkshopItemType;
  descripcion: string;
  cantidad: number | null;
  unidadMedida: string | null;
  orden: number;
}

export interface WorkshopProgress {
  total: number;
  completados: number;
  pendientes: number;
  porcentaje: number; // 0–100, entero
  procesoCompleto: boolean;
}

export interface WorkshopValidationError {
  field: string;
  message: string;
}

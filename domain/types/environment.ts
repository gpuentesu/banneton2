// domain/types/environment.ts
// RF_08 — Registrar variables geográficas y ambientales

export interface EnvironmentRange {
  min: number;
  max: number;
  unit: string;
  label: string;
}

// Rangos aceptables tomados del mockup / flujo normal (paso 4) de RF_08.
export const ENVIRONMENT_RANGES = {
  humedadRelativa: { min: 0, max: 100, unit: "%", label: "Humedad relativa" },
  temperaturaAmbiente: { min: -10, max: 50, unit: "°C", label: "Temperatura ambiente" },
  altitud: { min: 0, max: 5000, unit: "m.s.n.m.", label: "Altitud" },
  presionBarometrica: { min: 300, max: 1100, unit: "hPa", label: "Presión barométrica" },
} as const satisfies Record<string, EnvironmentRange>;

export type EnvironmentField = keyof typeof ENVIRONMENT_RANGES;

export interface RegisterEnvironmentCommand {
  humedadRelativa: number;
  temperaturaAmbiente: number;
  altitud: number;
  presionBarometrica: number;
  ciudadReferencia?: string;
  sincronizacionAutomatica?: boolean;
  idCreadoPor?: number;
}

export interface EnvironmentValidationError {
  field: string;
  message: string;
}

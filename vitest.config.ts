import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node", // Como es pura lógica matemática, 'node' es ultra rápido
		include: ["**/*.{test,spec}.ts"], // Esto le dice explícitamente qué buscar
	},
});

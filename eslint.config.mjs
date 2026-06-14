import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint"; // <-- Integración oficial para TypeScript 5

export default [
	// 1. Archivos que vamos a ignorar por completo
	{
		ignores: [
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
			"coverage/**",
			"./app/layout.tsx",
			"./app/api/roles/route.ts"
		]
	},

	// 2. Configuración base recomendada para JS y TypeScript
	js.configs.recommended,
	...tseslint.configs.recommended,

	// 3. Tus reglas personalizadas aplicadas al STACK REAL (*.ts, *.tsx, *.js, *.jsx)
	{
		files: ["**/*.{js,mjs,cjs,ts,tsx}"], // <-- ¡Aquí está la magia! Ahora sí lee tus archivos
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			parser: tseslint.parser, // <-- Obligatorio para que entienda TypeScript
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},
		rules: {
			// 1. Indentación obligatoria con Tabs
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			
			// 2. Forzar el uso de camelCase
			"camelcase": ["error", { "properties": "always", "ignoreDestructuring": false }],
			
			// 3. Buenas prácticas y limpieza
			"no-unused-vars": "off", // Apagamos la de JS para usar la de TS que es más precisa
			"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
			
			"quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
			"semi": ["error", "always"],
			"eol-last": ["error", "always"],
			"prefer-const": "error",
			"no-var": "error",
			"curly": ["error", "all"]
		}
	}
];

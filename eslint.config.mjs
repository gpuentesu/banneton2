import js from "@eslint/js";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export default [
	// Aplicar la configuración recomendada de ESLint
	js.configs.recommended,
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"coverage/**" // Ideal ahora que sumamos Jest
	]),

	{
		// Aplicar a archivos JavaScript y MJS
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},

    
		rules: {
			// 1. Identación obligatoria con Tabs
			"indent": ["error", "tab", { "SwitchCase": 1 }],
            
			// 2. Forzar el uso de camelCase para variables y funciones
			"camelcase": ["error", { "properties": "always", "ignoreDestructuring": false }],
            
			// 3. Buenas prácticas y utilidades adicionales de limpieza:

			// Evitar variables declaradas que no se usan
			"no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            
			// Forzar el uso de comillas simples (puedes cambiarlo a "double" si prefieres dobles)
			"quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
            
			// Exigir punto y coma al final de cada sentencia
			"semi": ["error", "always"],
            

            
			// Asegurar que haya un salto de línea al final de cada archivo
			"eol-last": ["error", "always"],
            
			// Preferir el uso de 'const' sobre 'let' si la variable nunca se reasigna
			"prefer-const": "error",
            
			// Evitar el uso de 'var' por completo (forzar let y const)
			"no-var": "error",
            
			// Exigir llaves en bloques de control (if, else, for, while) para evitar errores sintácticos
			"curly": ["error", "all"],
            
		}
	}
];

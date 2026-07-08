"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

// Instanciamos Prisma de forma limpia
const prisma = new PrismaClient();

/**
 * Valida las credenciales de correo y contraseña e inicia la sesión del usuario.
 */
export async function ejecutarLogin(formData: FormData) {
	const emailInput = formData.get("email") as string;
	const passwordInput = formData.get("password") as string;

	if (!emailInput || !passwordInput) {
		redirect("/login?error=invalid");
	}

	// Buscamos el usuario e incluimos su rol asociado de la BD
	const usuarioEncontrado = await prisma.usuario.findUnique({
		where: { email: emailInput },
		include: { rol: true }
	});

	// Validación contra el campo password que acabamos de inyectar
	if (!usuarioEncontrado || !usuarioEncontrado.activo || usuarioEncontrado.password !== passwordInput) {
		redirect("/login?error=invalid");
	}

	const cookieStore = await cookies();
	const nombreRol = usuarioEncontrado.rol.nombre_rol.toLowerCase();

	// Seteamos la cookie de sesión que leerá el Middleware de Nivel 1
	cookieStore.set("session_role", nombreRol, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 8 // 8 horas de jornada de panadería
	});

	// Redirección por roles
	if (nombreRol === "administrador") {
		redirect("/admin");
	} else {
		redirect("/produccion");
	}
}

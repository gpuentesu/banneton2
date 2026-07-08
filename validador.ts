import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLES_PERMITIDOS_POR_RUTA: Record<string, string[]> = {
	"/admin": ["administrador"],
	"/recetas/crear": ["administrador", "jefe panadero"],
	"/recetas/editar": ["administrador", "jefe panadero"],
	"/formulas": ["administrador", "jefe panadero"],
	"/produccion": ["administrador", "jefe panadero", "panadero"],
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const cookieSesion = request.cookies.get("session_role");
	const rolUsuario = cookieSesion?.value ? cookieSesion.value.toLowerCase() : null;

	for (const [rutaBase, rolesPermitidos] of Object.entries(ROLES_PERMITIDOS_POR_RUTA)) {
		if (pathname.startsWith(rutaBase)) {
			if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
				const urlRedireccion = rolUsuario 
					? new URL("/dashboard?error=no-autorizado", request.url)
					: new URL("/login", request.url);
				
				return NextResponse.redirect(urlRedireccion);
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/recetas/:path*", "/formulas/:path*", "/produccion/:path*"],
};

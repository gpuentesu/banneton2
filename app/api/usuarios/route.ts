import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/domain/prisma";

// GET /api/usuarios?rol=Panadero — Lista usuarios activos, opcionalmente
// filtrados por nombre de rol. Usado para los selects de personal
// responsable / supervisor del reporte de producción (RF_16).
export async function GET(request: NextRequest) {
	try {
		const rolFiltro = request.nextUrl.searchParams.get("rol");

		const usuarios = await prisma.usuario.findMany({
			where: {
				activo: true,
				...(rolFiltro ? { rol: { nombre_rol: { equals: rolFiltro, mode: "insensitive" } } } : {}),
			},
			include: { rol: true },
			orderBy: { nombre_usuario: "asc" },
		});

		return NextResponse.json({ ok: true, data: usuarios });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ ok: false, error: "Error al obtener el listado de usuarios" },
			{ status: 500 },
		);
	}
}

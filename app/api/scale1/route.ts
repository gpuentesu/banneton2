import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET() {
	try {
		const recetasRaw = await prisma.receta_subreceta.findMany({
			include: {
				catalogo_componente: true
			}
		});

		// Mapeamos al contrato camelCase para el frontend
		const recetasMapeadas = recetasRaw.map((receta) => ({
			idComponente: receta.id_componente,
			nombre: receta.catalogo_componente?.nombre || `Receta #${receta.id_componente}`
		}));

		return NextResponse.json(recetasMapeadas);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error al cargar el catálogo de recetas de Docker" },
			{ status: 500 }
		);
	}
}

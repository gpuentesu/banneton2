import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/roles — Lista todos los roles (entidad base del sistema)
export async function GET() {
  try {
    const roles = await prisma.rol.findMany({
      orderBy: { id_rol: "asc" },
    });
    return NextResponse.json({ ok: true, data: roles });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}

// POST /api/roles — Crea un nuevo rol
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre_rol } = body;

    if (!nombre_rol) {
      return NextResponse.json(
        { ok: false, error: "nombre_rol es requerido" },
        { status: 400 }
      );
    }

    const rol = await prisma.rol.create({
      data: { nombre_rol },
    });

    return NextResponse.json({ ok: true, data: rol }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al crear registro" },
      { status: 500 }
    );
  }
}

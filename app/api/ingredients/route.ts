import { NextResponse } from "next/server";
import { RegisterIngredientUseCase } from "@/services/ingredient/RegisterIngredient.usecase"; 
import { prisma } from "@/domain/prisma"; 

// ==========================================
// POST: CREAR UN NUEVO INGREDIENTE
// ==========================================
export async function POST(request: Request) {
    try {
        // 1. Recepción: Extraemos los datos que envía el usuario (frontend o Postman)
        const body = await request.json(); 
        
        // 2. Procesamiento: Le pasamos los datos al Caso de Uso (el cerebro)
        const registerUseCase = new RegisterIngredientUseCase();
        const newIngredient = await registerUseCase.execute(body); 
        
        // 3. Respuesta: Devolvemos el ingrediente creado con un status 201 (Created)
        return NextResponse.json(newIngredient, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error interno";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

// ==========================================
// GET: LISTAR TODOS LOS INGREDIENTES
// ==========================================
export async function GET() {
    try {
        const ingredients = await prisma.catalogo_componente.findMany({
            where: { activo: true }, 
            include: {
                ingrediente_base: true 
            }
        });
        
        return NextResponse.json(ingredients, { status: 200 });
    } catch (error) {
        // 🔥 AGREGAMOS ESTA LÍNEA PARA VER EL ERROR REAL EN LA TERMINAL:
        console.error("🔥 ERROR REAL DE PRISMA:", error);
        
        return NextResponse.json({ error: "Error al obtener ingredientes" }, { status: 500 });
    }
}
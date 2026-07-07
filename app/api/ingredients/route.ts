import { NextResponse } from "next/server";
import { RegisterIngredientUseCase } from "@/domain/useCases/ingredient/RegisterIngredient.usecase"; 

export async function POST(request: Request) {
	try {
		const body = await request.json(); 
		const registerUseCase = new RegisterIngredientUseCase();
		const newIngredient = await registerUseCase.execute(body); 
		return NextResponse.json(newIngredient, { status: 201 });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Error interno";
		return NextResponse.json({ error: errorMessage || "Error interno" }, { status: 400 });
	}
}

export async function GET() {
	try {
		return NextResponse.json({ message: "Aquí vendrán los ingredientes" });
	} catch (error) {
		return NextResponse.json({ error: "Error al obtener ingredientes" }, { status: 500 });
	}
}

"use client";

import { useState, useEffect } from "react";
import { RecetaEscaladaResultado } from "../../domain/data/sacaleLogic";

interface RecetaDesplegable {
	idComponente: number;
	nombre: string;
}

export default function EscaladorPanaderoPage() {
	// --- ESTADOS DE CONTROL (camelCase) ---
	const [recetas, setRecetas] = useState<RecetaDesplegable[]>([]);
	const [idSeleccionado, setIdSeleccionado] = useState<string>("");
	const [pesoObjetivo, setPesoObjetivo] = useState<string>("5000"); // 5kg por defecto
	const [resultado, setResultado] = useState<RecetaEscaladaResultado | null>(null);
	const [cargando, setCargando] = useState<boolean>(false);
	const [errorMsj, setErrorMsj] = useState<string | null>(null);

	// Cargar las recetas disponibles al montar el componente
	useEffect(() => {
		async function cargarCatalogo() {
			try {
				const res = await fetch("/api/scale1");
				if (!res.ok) {throw new Error("Error HTTP al obtener recetas");}
				const data = await res.json();
				setRecetas(data);
				if (data.length > 0) {setIdSeleccionado(data[0].idComponente.toString());}
			} catch (err) {
				setErrorMsj("No se pudo conectar con el catálogo de Docker.");
			}
		}
		cargarCatalogo();
	}, []);

	// Manejar el envío del formulario de cálculo
	const manejarCalcular = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!idSeleccionado || !pesoObjetivo) {return;}

		setCargando(true);
		setErrorMsj(null);

		try {
			const res = await fetch("/api/scale1/formulas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					idComponente: Number(idSeleccionado),
					pesoTotalObjetivo: Number(pesoObjetivo)
				})
			});

			const data = await res.json();
			if (!res.ok) {throw new Error(data.error || "Error en el cálculo");}

			setResultado(data);
		} catch (err: any) {
			setErrorMsj(err.message);
			setResultado(null);
		} finally {
			setCargando(false);
		}
	};

	return (
		<main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
			<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
				
				{/* Cabecera */}
				<header className="mb-8 border-b border-gray-100 pb-4">
					<h1 className="text-3xl font-bold text-amber-800">🥖 Banneton Escalador</h1>
					<p className="text-gray-500 mt-1">Calculadora Automatizada basada en Porcentaje Panadero Real</p>
				</header>

				{errorMsj && (
					<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm">
						{errorMsj}
					</div>
				)}

				{/* Formulario de Entrada */}
				<form onSubmit={manejarCalcular} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Receta</label>
						<select
							value={idSeleccionado}
							onChange={(e) => setIdSeleccionado(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition"
						>
							{recetas.length === 0 ? (
								<option>Cargando catálogo...</option>
							) : (
								recetas.map((r) => (
									<option key={r.idComponente} value={r.idComponente}>
										{r.nombre}
									</option>
								))
							)}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Masa Total Objetivo (g)</label>
						<input
							type="number"
							value={pesoObjetivo}
							onChange={(e) => setPesoObjetivo(e.target.value)}
							placeholder="Ej: 5000"
							min="1"
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={cargando || recetas.length === 0}
							className="w-full p-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
						>
							{cargando ? "Computando..." : "Recalcular Masa"}
						</button>
					</div>
				</form>

				{/* Resultados de la Fórmula Escalada */}
				{resultado && (
					<section className="mt-8 animation-fade-in">
						<div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 flex justify-between items-center">
							<span className="font-medium text-amber-900">Peso Total de Tanda Entregado:</span>
							<span className="text-xl font-bold text-amber-800">{resultado.pesoTotalObjetivo} g</span>
						</div>

						<h3 className="text-lg font-semibold text-gray-800 mb-4">Hoja de Pesaje para Báscula Digital</h3>
						<div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
							<table className="min-w-full divide-y divide-gray-200 text-left text-sm">
								<thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
									<tr>
										<th className="px-6 py-4">Ingrediente Insumo</th>
										<th className="px-6 py-4 text-right">Porcentaje Panadero</th>
										<th className="px-6 py-4 text-right bg-amber-50/50 text-amber-900">Nueva Cantidad Pesada</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 text-gray-600">
									{resultado.ingredientes.map((ing) => (
										<tr key={ing.idDetalle} className="hover:bg-gray-50/70 transition">
											<td className="px-6 py-4 font-medium text-gray-900">{ing.nombre}</td>
											<td className="px-6 py-4 text-right">{ing.porcentajePanadero}%</td>
											<td className="px-6 py-4 text-right font-bold text-amber-800 bg-amber-50/20">
												{ing.cantidadNueva.toLocaleString()} {ing.unidad.toLowerCase()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}

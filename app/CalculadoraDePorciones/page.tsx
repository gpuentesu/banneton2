"use client";
import { calcFinalOvenTime } from "../../lib/portionCalcLogic";

import { SetData } from "../../lib/portionCalcLogic";

import { FinalEstimation } from "../../lib/portionCalcLogic";

import React, { useState } from "react";

interface EstimatorModalProps {
  onCancel: () => void;
  onEstimate: (data: EstimatorData) => void;
}

interface EstimatorData {
  unidades: number;
  unidadesPorTanda: number;
  numeroDeHornos: number;
  tiempoDeHorneado: number;
  tiempoDeManiobra: number;
}

export default function ProductionEstimatorModal({ 
	onCancel, 
}: Partial<EstimatorModalProps>) {
	// Estado local para capturar los parámetros de producción
	const [formData, setFormData] = useState<EstimatorData>({
		unidades: 120,
		unidadesPorTanda: 20,
		numeroDeHornos: 2,
		tiempoDeHorneado: 10,
		tiempoDeManiobra: 20,
	});

	const handleChange = (field: keyof EstimatorData, value: number) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const datos : SetData  = {
			units: formData.unidades,
			unitsPerSet: formData.unidadesPorTanda,
			ovenTime: formData.tiempoDeHorneado,
			handlingTime: formData.tiempoDeManiobra,  
			ovenNumber: formData.numeroDeHornos
		};

		const resultado : FinalEstimation = calcFinalOvenTime(datos);
		// <------ FALTA UN CONSTRUCTOR PARA CUMPLIR CON CLEAN CODE ------>
		alert("Tiempo: " + resultado.finalTimeMinutes + " minutos" +
      "\n Numero de Tandas: " + resultado.setNumber +
    "\n Tiempo de maniobra: " + resultado.totalHandlingTime + " minutos" +
    "\n Tiempo en el horno: " + resultado.totalTimeOven + " minutos" );
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4 font-sans antialiased">
			{/* Contenedor Principal del Formulario */}
			<div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200/60 p-6 md:p-8 transition-all">
        
				{/* Encabezado */}
				<div className="flex items-start gap-3 mb-2">
					<div className="text-[#934B00] mt-0.5 shrink-0">
						{/* Icono de Reloj con Engranaje/Check */}
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h2 className="text-xl font-bold text-[#5C3206] tracking-tight">Estimador de tiempo</h2>
						<p className="text-xs text-neutral-500 mt-0.5">
              Calcula el tiempo de tu proximo ciclo de horneado
						</p>
					</div>
				</div>

				<hr className="border-neutral-100 my-4" />

				{/* Formulario */}
				<form onSubmit={handleSubmit} className="space-y-4">
          



					{/* Fila superior: 3 columnas para inputs numéricos */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{/* Input: Número de Unidades */}
						<div>
							<label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Número de Unidades
							</label>
							<input
								type="number"
								value={formData.unidades === 0 ? "" : formData.unidades}
								onChange={(e) => handleChange("unidades", parseInt(e.target.value) || 0)}
								className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-[#934B00] focus:ring-1 focus:ring-[#934B00] transition-colors"
								placeholder="120"
							/>
						</div>

						{/* Input: Unidades por Tanda */}
						<div>
							<label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Unidades por Tanda
							</label>
							<input
								type="number"
								value={formData.unidadesPorTanda === 0 ? "" : formData.unidadesPorTanda}
								onChange={(e) => handleChange("unidadesPorTanda", parseInt(e.target.value) || 0)}
								className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-[#934B00] focus:ring-1 focus:ring-[#934B00] transition-colors"
								placeholder="24"
							/>
						</div>

						{/* Input: Número de Hornos */}
						<div>
							<label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Número de Hornos
							</label>
							<input
								type="number"
								value={formData.numeroDeHornos  === 0 ? "" : formData.numeroDeHornos}
								onChange={(e) => handleChange("numeroDeHornos", parseInt(e.target.value) || 0)}
								className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-[#934B00] focus:ring-1 focus:ring-[#934B00] transition-colors"
								placeholder="2"
							/>
						</div>
					</div>

					{/* Fila intermedia: Selects de Tiempo */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* Select: Tiempo de Horneado */}
						<div>
							<label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Tiempo de Horneado
							</label>
							<div className="relative">
								<input
									type="number"
									value={formData.tiempoDeHorneado  === 0 ? "" : formData.tiempoDeHorneado}
									onChange={(e) => handleChange("tiempoDeHorneado", parseInt(e.target.value) || 0)}
									className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-[#934B00] focus:ring-1 focus:ring-[#934B00] transition-colors"
									placeholder="2"
								/>
							</div>
						</div>

						{/* Select: Tiempo de maniobra */}
						<div>
							<label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                Tiempo de maniobra
							</label>
							<div className="relative">
								<input
									type="number"
									value={formData.tiempoDeManiobra  === 0 ? "" : formData.tiempoDeManiobra} 
									onChange={(e) => handleChange("tiempoDeManiobra", parseInt(e.target.value) || 0)}
									className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-[#934B00] focus:ring-1 focus:ring-[#934B00] transition-colors"
									placeholder="10"
								/>
							</div>
						</div>
					</div>

					{/* Info Box: Nota aclaratoria */}
					<div className="w-full bg-[#FDF2E9] border border-[#FADBD8]/30 rounded-xl p-3.5 flex gap-3 items-start">
						<div className="bg-[#5C3206]/10 text-[#5C3206] p-1 rounded-full shrink-0 mt-0.5">
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
							</svg>
						</div>
						<p className="text-[11px] text-[#A06A38] leading-normal font-medium">
              La estimación toma en cuenta el uso de hornos en simultáneo
						</p>
					</div>

					{/* Botones de Acción */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onCancel}
							className="px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors"
						>
              Cancelar
						</button>
						<button
							type="submit"
							className="bg-[#934B00] hover:bg-[#7A3E00] active:scale-[0.98] text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-[#934B00]/10"
						>
              Estimar tiempo
						</button>
					</div>

				</form>
			</div>
		</div>
	);
}

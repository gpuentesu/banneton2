"use client";

import { useState } from "react";
import { Droplet, Flame, Zap, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ServiceRates {
  waterRate: string;
  waterAdditional: string;
  gasRate: string;
  electricityRate: string;
  ovenPower: string;
  electricityFixed: string;
}

export default function ConfiguracionPage() {
	const [rates, setRates] = useState<ServiceRates>({
		waterRate: "0.85",
		waterAdditional: "15",
		gasRate: "2.50",
		electricityRate: "0.12",
		ovenPower: "3.5",
		electricityFixed: "50",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: keyof ServiceRates, value: string) => {
		setRates({ ...rates, [field]: value });

		const numValue = parseFloat(value);
		if (isNaN(numValue) || numValue < 0) {
			setErrors({ ...errors, [field]: "Debe ser un n&uacute;mero positivo" });
		} else {
			const newErrors = { ...errors };
			delete newErrors[field];
			setErrors(newErrors);
		}
	};

	const handleSave = () => {
		if (Object.keys(errors).length === 0) {
			toast.success("Configuraci&oacute;n guardada correctamente", {
				description: "Los costos fijos han sido actualizados",
				duration: 3000,
				style: {
					background: "#A8C5A0",
					color: "#3D3229",
					border: "none",
				},
			});
		}
	};

	return (
		<div className="min-h-screen p-8 bg-background">
			<Toaster />
			<div className="max-w-4xl mx-auto">
				{/* Breadcrumb */}
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/configuracion">
                Configuraci&oacute;n
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Servicios y Costos Fijos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-foreground mb-2">
            Configuraci&oacute;n de Servicios
					</h1>
					<p className="text-sm text-muted-foreground">
            Define las tarifas de servicios b&aacute;sicos para calcular costos de
            producci&oacute;n
					</p>
				</div>

				{/* Water Section */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-[#A8C5A0]/20 flex items-center justify-center">
							<Droplet className="w-6 h-6 text-[#A8C5A0]" strokeWidth={1.5} />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-foreground">Agua</h2>
							<p className="text-sm text-muted-foreground">
                Consumo de agua en la producci&oacute;n
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<Label htmlFor="waterRate">Tarifa ($/litro)</Label>
							<Input
								id="waterRate"
								type="number"
								step="0.01"
								value={rates.waterRate}
								onChange={(e) => handleChange("waterRate", e.target.value)}
								className={`mt-2 ${
									errors.waterRate ? "border-[#D4816A] border-2" : ""
								}`}
							/>
							{errors.waterRate && (
								<p className="text-sm text-[#D4816A] mt-1">
									{errors.waterRate}
								</p>
							)}
						</div>

						<div>
							<div className="flex items-center gap-2 mb-2">
								<Label htmlFor="waterAdditional">
                  % adicional por otros usos
								</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Info className="w-4 h-4 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">
                        Incluye limpieza, lavado de utensilios y otros usos
                        indirectos del agua en el proceso de producci&oacute;n
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<Input
								id="waterAdditional"
								type="number"
								step="1"
								value={rates.waterAdditional}
								onChange={(e) =>
									handleChange("waterAdditional", e.target.value)
								}
								className={`${
									errors.waterAdditional ? "border-[#D4816A] border-2" : ""
								}`}
							/>
							{errors.waterAdditional && (
								<p className="text-sm text-[#D4816A] mt-1">
									{errors.waterAdditional}
								</p>
							)}
						</div>
					</div>
				</Card>

				{/* Gas Section */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-[#D4816A]/20 flex items-center justify-center">
							<Flame className="w-6 h-6 text-[#D4816A]" strokeWidth={1.5} />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-foreground">Gas</h2>
							<p className="text-sm text-muted-foreground">
                Consumo de gas para hornos
							</p>
						</div>
					</div>

					<div>
						<Label htmlFor="gasRate">Tarifa ($/hora de horno)</Label>
						<Input
							id="gasRate"
							type="number"
							step="0.01"
							value={rates.gasRate}
							onChange={(e) => handleChange("gasRate", e.target.value)}
							className={`mt-2 ${
								errors.gasRate ? "border-[#D4816A] border-2" : ""
							}`}
						/>
						{errors.gasRate && (
							<p className="text-sm text-[#D4816A] mt-1">{errors.gasRate}</p>
						)}
					</div>
				</Card>

				{/* Electricity Section */}
				<Card className="p-6 mb-8 bg-white shadow-sm border-[1.5px]">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-[#E8B86D]/20 flex items-center justify-center">
							<Zap className="w-6 h-6 text-[#E8B86D]" strokeWidth={1.5} />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-foreground">
                Electricidad
							</h2>
							<p className="text-sm text-muted-foreground">
                Consumo el&eacute;ctrico de equipos
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<Label htmlFor="electricityRate">Tarifa ($/kWh)</Label>
							<Input
								id="electricityRate"
								type="number"
								step="0.01"
								value={rates.electricityRate}
								onChange={(e) =>
									handleChange("electricityRate", e.target.value)
								}
								className={`mt-2 ${
									errors.electricityRate ? "border-[#D4816A] border-2" : ""
								}`}
							/>
							{errors.electricityRate && (
								<p className="text-sm text-[#D4816A] mt-1">
									{errors.electricityRate}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="ovenPower">Potencia del horno (kW)</Label>
							<Input
								id="ovenPower"
								type="number"
								step="0.1"
								value={rates.ovenPower}
								onChange={(e) => handleChange("ovenPower", e.target.value)}
								className={`mt-2 ${
									errors.ovenPower ? "border-[#D4816A] border-2" : ""
								}`}
							/>
							{errors.ovenPower && (
								<p className="text-sm text-[#D4816A] mt-1">
									{errors.ovenPower}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="electricityFixed">Valor agregado fijo ($)</Label>
							<Input
								id="electricityFixed"
								type="number"
								step="1"
								value={rates.electricityFixed}
								onChange={(e) =>
									handleChange("electricityFixed", e.target.value)
								}
								className={`mt-2 ${
									errors.electricityFixed ? "border-[#D4816A] border-2" : ""
								}`}
							/>
							{errors.electricityFixed && (
								<p className="text-sm text-[#D4816A] mt-1">
									{errors.electricityFixed}
								</p>
							)}
						</div>
					</div>
				</Card>

				{/* Save Button */}
				<div className="flex justify-center">
					<Button
						size="lg"
						onClick={handleSave}
						disabled={Object.keys(errors).length > 0}
						className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-12"
					>
						<CheckCircle2 className="w-5 h-5 mr-2" />
            Guardar configuraci&oacute;n
					</Button>
				</div>
			</div>
		</div>
	);
}

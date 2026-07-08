"use client";

import { useState } from "react";
import { TestTube2, AlertTriangle, Save, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RecipeValue {
  name: string;
  original: string;
  modified: string;
  unit: string;
  type: "ingredient" | "time" | "count" | "substitute";
  hasChanged?: boolean;
}

export default function ReportesPage() {
	const [values, setValues] = useState<RecipeValue[]>([
		{
			name: "Harina integral",
			original: "500",
			modified: "500",
			unit: "g",
			type: "ingredient",
		},
		{
			name: "Agua",
			original: "350",
			modified: "400",
			unit: "ml",
			type: "ingredient",
			hasChanged: true,
		},
		{
			name: "Sal marina",
			original: "10",
			modified: "10",
			unit: "g",
			type: "ingredient",
		},
		{
			name: "Aceite de oliva",
			original: "Aceite de oliva",
			modified: "Aceite de girasol",
			unit: "",
			type: "substitute",
			hasChanged: true,
		},
		{
			name: "Tiempo de horneado",
			original: "35",
			modified: "40",
			unit: "min",
			type: "time",
			hasChanged: true,
		},
		{
			name: "Unidades por tanda",
			original: "12",
			modified: "15",
			unit: "unidades",
			type: "count",
			hasChanged: true,
		},
	]);

	const handleModifiedChange = (index: number, value: string) => {
		const newValues = [...values];
		newValues[index].modified = value;
		newValues[index].hasChanged = value !== newValues[index].original;
		setValues(newValues);
	};

	const hydration = 80;
	const totalCost = 9.23;
	const costPerUnit = 0.62;
	const bakerPercentage = 105;

	const isHydrationOutOfRange = hydration < 40 || hydration > 90;

	return (
		<div className="min-h-screen bg-background">
			{/* Sandbox Banner */}
			<div className="bg-[#E8B86D] border-b-2 border-[#D4A05D] px-8 py-4 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto flex items-center gap-3">
					<TestTube2 className="w-5 h-5 text-[#3D3229]" />
					<p className="font-medium text-[#3D3229]">
            Modo Previsualizaci&oacute;n &mdash; Los cambios NO afectan los datos maestros
					</p>
				</div>
			</div>

			<div className="p-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-foreground mb-2">
              Previsualizaci&oacute;n Experimental
						</h1>
						<p className="text-sm text-muted-foreground">
              Prueba modificaciones a la receta antes de crear una nueva versi&oacute;n
						</p>
					</div>

					{/* Comparison Table */}
					<Card className="mb-8 overflow-hidden shadow-md border-[1.5px]">
						<div className="grid grid-cols-2 border-b border-border">
							<div className="p-6 bg-[#FDF6EE] border-r border-border">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-foreground">
                    Original (V3)
									</h3>
									<Badge
										variant="outline"
										className="text-xs border-[#8B6F4E] text-[#8B6F4E]"
									>
                    Bloqueado
									</Badge>
								</div>
							</div>
							<div className="p-6 bg-white border-r border-border">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-foreground">
                    Modificado (Sandbox)
									</h3>
									<Badge className="text-xs bg-[#E8B86D] text-[#3D3229] hover:bg-[#E8B86D]/90">
                    Editable
									</Badge>
								</div>
							</div>
						</div>

						{/* Comparison Rows */}
						{values.map((item, index) => (
							<div
								key={index}
								className={`grid grid-cols-2 border-b border-border last:border-b-0 ${
									item.hasChanged ? "bg-[#FFF9E6]" : ""
								}`}
							>
								{/* Original Value */}
								<div className="p-6 bg-[#FDF6EE] border-r border-border">
									<Label className="text-sm text-muted-foreground mb-2 block">
										{item.name}
									</Label>
									<div className="flex items-center gap-2">
										<Input
											value={item.original}
											disabled
											className="bg-muted/50 cursor-not-allowed"
										/>
										{item.unit && (
											<span className="text-sm text-muted-foreground min-w-[60px]">
												{item.unit}
											</span>
										)}
									</div>
								</div>

								{/* Modified Value */}
								<div className="p-6 bg-white">
									<Label className="text-sm text-foreground mb-2 block">
										{item.name}
									</Label>
									{item.type === "substitute" ? (
										<Select
											value={item.modified}
											onValueChange={(value) =>
												handleModifiedChange(index, value)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Aceite de oliva">
                          Aceite de oliva
												</SelectItem>
												<SelectItem value="Aceite de girasol">
                          Aceite de girasol
												</SelectItem>
												<SelectItem value="Mantequilla">Mantequilla</SelectItem>
												<SelectItem value="Margarina">Margarina</SelectItem>
											</SelectContent>
										</Select>
									) : (
										<div className="flex items-center gap-2">
											<Input
												type="number"
												value={item.modified}
												onChange={(e) =>
													handleModifiedChange(index, e.target.value)
												}
												className="border-[#8B6F4E]"
											/>
											{item.unit && (
												<span className="text-sm text-foreground min-w-[60px]">
													{item.unit}
												</span>
											)}
											{item.hasChanged && (
												<ArrowRight className="w-4 h-4 text-[#E8B86D]" />
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</Card>

					{/* Real-time Metrics Panel */}
					<Card className="p-6 mb-8 shadow-sm border-[1.5px]">
						<h3 className="text-lg font-semibold text-foreground mb-6">
              M&eacute;tricas en tiempo real
						</h3>
						<div className="grid grid-cols-4 gap-6">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<p className="text-sm text-muted-foreground">
                    Hidrataci&oacute;n total
									</p>
									{isHydrationOutOfRange && (
										<Badge className="bg-[#E8B86D] text-[#3D3229] hover:bg-[#E8B86D]/90 text-xs">
                      Fuera de rango
										</Badge>
									)}
								</div>
								<p className="text-2xl font-semibold text-foreground">
									{hydration}%
								</p>
								{isHydrationOutOfRange && (
									<p className="text-xs text-[#D4816A] mt-1">
                    Valor fuera de rango t&eacute;cnico
									</p>
								)}
							</div>

							<div>
								<p className="text-sm text-muted-foreground mb-2">
                  Costo estimado total
								</p>
								<p className="text-2xl font-semibold text-foreground">
                  ${totalCost.toFixed(2)}
								</p>
								<p className="text-xs text-[#A8C5A0] mt-1">
                  +5.2% vs original
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground mb-2">
                  Costo por unidad
								</p>
								<p className="text-2xl font-semibold text-foreground">
                  ${costPerUnit.toFixed(2)}
								</p>
								<p className="text-xs text-[#D4816A] mt-1">
                  -3.1% vs original
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground mb-2">
                  % de panadero
								</p>
								<p className="text-2xl font-semibold text-foreground">
									{bakerPercentage}%
								</p>
								<p className="text-xs text-muted-foreground mt-1">
                  Sin cambios
								</p>
							</div>
						</div>

						{isHydrationOutOfRange && (
							<div className="mt-6 p-4 bg-[#E8B86D]/10 rounded-lg border border-[#E8B86D]">
								<div className="flex items-start gap-3">
									<AlertTriangle className="w-5 h-5 text-[#E8B86D] mt-0.5" />
									<div>
										<p className="font-medium text-[#3D3229] mb-1">
                      Advertencia t&eacute;cnica
										</p>
										<p className="text-sm text-foreground">
                      La hidrataci&oacute;n est&aacute; fuera del rango t&eacute;cnico recomendado
                      (40-90%). Esto puede afectar la textura y estructura del
                      pan.
										</p>
									</div>
								</div>
							</div>
						)}
					</Card>

					{/* Action Buttons */}
					<div className="flex gap-4 justify-end">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									size="lg"
									className="border-muted-foreground text-muted-foreground hover:bg-destructive/10"
								>
									<X className="w-5 h-5 mr-2" />
                  Descartar cambios
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>&iquest;Descartar cambios?</AlertDialogTitle>
									<AlertDialogDescription>
                    Se perder&aacute;n todas las modificaciones realizadas en el modo
                    sandbox. Esta acci&oacute;n no se puede deshacer.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction className="bg-[#D4816A] hover:bg-[#C37159]">
                    Descartar
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<Button
							variant="outline"
							size="lg"
							className="border-[#8B6F4E] text-[#8B6F4E] hover:bg-[#8B6F4E]/10"
						>
              Seguir ajustando
						</Button>

						<Button
							size="lg"
							className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-8"
						>
							<Save className="w-5 h-5 mr-2" />
              Guardar como nueva versi&oacute;n
						</Button>
					</div>

					{/* Changes Summary Footer */}
					<div className="mt-6 p-4 bg-[#FFF9E6] rounded-lg border border-[#E8B86D]">
						<p className="text-sm text-foreground">
							<span className="font-medium">
								{values.filter((v) => v.hasChanged).length} cambios detectados:
							</span>{" "}
							{values
								.filter((v) => v.hasChanged)
								.map((v) => v.name)
								.join(", ")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

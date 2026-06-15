"use client";

import { useState } from "react";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubRecipeVersion {
  id: string;
  version: string;
  name: string;
  description: string;
  costPerKg: number;
  date: string;
  isActive: boolean;
}

interface RecipeComponent {
  id: string;
  name: string;
  type: "ingredient" | "subrecipe";
  amount?: string;
  versions?: SubRecipeVersion[];
  selectedVersion?: string;
  hasMultipleVersions?: boolean;
}

const mockVersions: SubRecipeVersion[] = [
	{
		id: "v3",
		version: "V3",
		name: "Masa madre 48h",
		description: "Fermentacion reducida para produccion rapida",
		costPerKg: 2.45,
		date: "2026-06-10",
		isActive: true,
	},
	{
		id: "v2",
		version: "V2",
		name: "Masa madre 72h",
		description: "Fermentacion estandar con mejor sabor",
		costPerKg: 2.68,
		date: "2026-05-15",
		isActive: true,
	},
	{
		id: "v1",
		version: "V1",
		name: "Masa madre 96h",
		description: "Fermentacion larga - version original",
		costPerKg: 2.92,
		date: "2026-04-01",
		isActive: false,
	},
];

export default function RecetasPage() {
	const [components, setComponents] = useState<RecipeComponent[]>([
		{ id: "1", name: "Harina integral", type: "ingredient", amount: "500g" },
		{ id: "2", name: "Agua", type: "ingredient", amount: "350ml" },
		{
			id: "3",
			name: "Masa madre",
			type: "subrecipe",
			versions: mockVersions,
			selectedVersion: "v2",
			hasMultipleVersions: true,
		},
		{ id: "4", name: "Sal marina", type: "ingredient", amount: "10g" },
		{
			id: "5",
			name: "Poolish",
			type: "subrecipe",
			versions: [mockVersions[0]],
			selectedVersion: "v3",
			hasMultipleVersions: false,
		},
		{
			id: "6",
			name: "Pre-fermento",
			type: "subrecipe",
			versions: mockVersions,
			selectedVersion: "",
			hasMultipleVersions: true,
		},
	]);

	const [versionChange, setVersionChange] = useState<{
    from: string;
    to: string;
    costChange: number;
    hydrationChange: number;
  } | null>(null);

	const handleVersionChange = (componentId: string, newVersion: string) => {
		const component = components.find((c) => c.id === componentId);
		if (!component || !component.versions) {return;}

		const oldVersion = component.versions.find(
			(v) => v.id === component.selectedVersion
		);
		const newVersionData = component.versions.find((v) => v.id === newVersion);

		if (oldVersion && newVersionData) {
			const costChange =
        ((newVersionData.costPerKg - oldVersion.costPerKg) /
          oldVersion.costPerKg) *
        100;
			setVersionChange({
				from: oldVersion.version,
				to: newVersionData.version,
				costChange,
				hydrationChange: Math.random() * 5 - 2.5,
			});
		}

		setComponents(
			components.map((c) =>
				c.id === componentId ? { ...c, selectedVersion: newVersion } : c
			)
		);
	};

	return (
		<div className="min-h-screen p-8 bg-background">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-3xl font-semibold text-foreground">
              Pan de Molde Integral
						</h1>
						<Badge className="bg-[#E8B86D] text-[#3D3229] hover:bg-[#E8B86D]/90 px-4 py-1">
              En edici&oacute;n
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
            Selecciona las versiones de subrecetas para tu receta final
					</p>
				</div>

				{/* Components List */}
				<div className="space-y-4 mb-8">
					{components.map((component) => (
						<Card
							key={component.id}
							className="p-6 shadow-sm hover:shadow-md transition-shadow border-[1.5px]"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-medium text-foreground">
											{component.name}
										</h3>
										{component.type === "ingredient" && (
											<Badge
												variant="outline"
												className="text-xs border-[#C4A882] text-[#C4A882]"
											>
                        Ingrediente simple
											</Badge>
										)}
										{component.type === "subrecipe" && (
											<Badge
												variant="outline"
												className="text-xs border-[#8B6F4E] text-[#8B6F4E]"
											>
                        Subreceta
											</Badge>
										)}
									</div>

									{component.type === "ingredient" && (
										<p className="text-sm text-muted-foreground">
                      Cantidad: {component.amount}
										</p>
									)}

									{component.type === "subrecipe" && component.versions && (
										<div className="mt-4">
											{/* FA1: Single version - disabled dropdown */}
											{!component.hasMultipleVersions ? (
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<div className="w-full">
																<Select
																	value={component.selectedVersion}
																	disabled
																>
																	<SelectTrigger className="w-full bg-muted/50 cursor-not-allowed">
																		<SelectValue>
																			{component.versions[0].version} -{" "}
																			{component.versions[0].name}
																		</SelectValue>
																	</SelectTrigger>
																</Select>
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>Solo hay una versi&oacute;n disponible</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											) : (
												<>
													{/* FA2: No version selected - warning state */}
													{!component.selectedVersion && (
														<div className="mb-2 flex items-center gap-2 text-sm text-[#D4816A]">
															<AlertCircle className="w-4 h-4" />
															<span>Selecciona una versi&oacute;n activa</span>
														</div>
													)}

													<Select
														value={component.selectedVersion}
														onValueChange={(value) =>
															handleVersionChange(component.id, value)
														}
													>
														<SelectTrigger
															className={`w-full ${
																!component.selectedVersion
																	? "border-[#E8B86D] border-2"
																	: ""
															}`}
														>
															<SelectValue placeholder="Seleccionar versi&oacute;n" />
														</SelectTrigger>
														<SelectContent>
															{component.versions.map((version) => (
																<SelectItem
																	key={version.id}
																	value={version.id}
																	className="py-3"
																>
																	<div className="flex flex-col gap-1">
																		<div className="flex items-center gap-2">
																			<span className="font-medium">
																				{version.version} - {version.name}
																			</span>
																			{version.isActive ? (
																				<Badge className="text-xs bg-[#A8C5A0] text-[#3D3229] hover:bg-[#A8C5A0]/90">
                                          Activa
																				</Badge>
																			) : (
																				<Badge
																					variant="outline"
																					className="text-xs border-muted-foreground text-muted-foreground"
																				>
                                          Anterior
																				</Badge>
																			)}
																		</div>
																		<p className="text-xs text-muted-foreground">
																			{version.description}
																		</p>
																		<div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
																			<span>
                                        ${version.costPerKg.toFixed(2)}/kg
																			</span>
																			<span>&bull;</span>
																			<span>{version.date}</span>
																		</div>
																	</div>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</>
											)}
										</div>
									)}
								</div>
							</div>
						</Card>
					))}
				</div>

				{/* Summary Card - appears after version change */}
				{versionChange && (
					<Card className="p-6 mb-8 bg-[#FDF6EE] border-[#C4A882] border-2">
						<div className="flex items-start gap-3">
							<Info className="w-5 h-5 text-[#8B6F4E] mt-0.5" />
							<div className="flex-1">
								<h4 className="font-medium text-foreground mb-3">
                  Cambios aplicados: {versionChange.from} &rarr; {versionChange.to}
								</h4>
								<div className="grid grid-cols-3 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground mb-1">
                      Variaci&oacute;n de costo
										</p>
										<p
											className={`font-medium ${
												versionChange.costChange > 0
													? "text-[#D4816A]"
													: "text-[#A8C5A0]"
											}`}
										>
											{versionChange.costChange > 0 ? "+" : ""}
											{versionChange.costChange.toFixed(1)}%
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">
                      Variaci&oacute;n de hidrataci&oacute;n
										</p>
										<p className="font-medium text-foreground">
											{versionChange.hydrationChange > 0 ? "+" : ""}
											{versionChange.hydrationChange.toFixed(1)}%
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">% Panadero</p>
										<p className="font-medium text-foreground">
											{(100 + Math.random() * 10).toFixed(1)}%
										</p>
									</div>
								</div>
							</div>
						</div>
					</Card>
				)}

				{/* Save Button */}
				<div className="flex justify-end">
					<Button
						size="lg"
						className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-8"
					>
            Guardar receta
					</Button>
				</div>
			</div>
		</div>
	);
}

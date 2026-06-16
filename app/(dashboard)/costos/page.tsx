import { Wheat, Droplet, Flame, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface CostItem {
  label: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  calculated: boolean;
}

export default function CostosPage() {
	const ingredients = 8.45;
	const water = 0.32;
	const gas = 0;
	const electricity = 0;
	const total = ingredients + water + gas + electricity;
	const unitsPerBatch = 12;
	const costPerUnit = total / unitsPerBatch;
	const sellingPrice = 0.65;
	const isProfitable = costPerUnit <= sellingPrice;

	const costItems: CostItem[] = [
		{
			label: "Ingredientes",
			amount: ingredients,
			icon: <Wheat className="w-6 h-6" strokeWidth={1.5} />,
			color: "#8B6F4E",
			calculated: true,
		},
		{
			label: "Agua",
			amount: water,
			icon: <Droplet className="w-6 h-6" strokeWidth={1.5} />,
			color: "#A8C5A0",
			calculated: true,
		},
		{
			label: "Gas",
			amount: gas,
			icon: <Flame className="w-6 h-6" strokeWidth={1.5} />,
			color: "#D4816A",
			calculated: false,
		},
		{
			label: "Electricidad",
			amount: electricity,
			icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
			color: "#E8B86D",
			calculated: false,
		},
	];

	return (
		<div className="min-h-screen p-8 bg-background">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-3xl font-semibold text-foreground">
              Pan de Molde Integral
						</h1>
						<Badge className="bg-[#A8C5A0] text-[#3D3229] hover:bg-[#A8C5A0]/90 px-4 py-1">
              Costeo
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
            Desglose completo de costos por tanda de producci&oacute;n
					</p>
				</div>

				{/* Cost Dashboard */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{costItems.map((item) => (
						<Card
							key={item.label}
							className="p-6 shadow-sm hover:shadow-md transition-shadow border-[1.5px]"
						>
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
								style={{ backgroundColor: `${item.color}20` }}
							>
								<div style={{ color: item.color }}>{item.icon}</div>
							</div>
							<div className="text-sm text-muted-foreground mb-1">
								{item.label}
							</div>
							{item.calculated ? (
								<div className="text-2xl font-semibold text-foreground">
                  ${item.amount.toFixed(2)}
								</div>
							) : (
								<div className="text-sm text-muted-foreground italic">
                  $0.00 (no calculado)
								</div>
							)}
						</Card>
					))}
				</div>

				{/* Total Card */}
				<Card
					className={`p-8 mb-6 shadow-md border-[2px] ${
						!isProfitable
							? "border-[#D4816A] bg-[#D4816A]/5"
							: "border-[#8B6F4E]"
					}`}
				>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-4">
								<h2 className="text-2xl font-semibold text-foreground">
                  Costo Total
								</h2>
								{!isProfitable && (
									<AlertTriangle className="w-6 h-6 text-[#D4816A]" />
								)}
							</div>
							<div className="text-4xl font-bold text-foreground mb-4">
                ${total.toFixed(2)}
							</div>
							<div className="flex items-center gap-6 text-sm">
								<div>
									<span className="text-muted-foreground">Por tanda:</span>
									<span className="ml-2 font-medium text-foreground">
										{unitsPerBatch} unidades
									</span>
								</div>
								<div>
									<span className="text-muted-foreground">Por unidad:</span>
									<span className="ml-2 font-medium text-foreground">
                    ${costPerUnit.toFixed(2)}
									</span>
								</div>
								<div>
									<span className="text-muted-foreground">
                    Precio de venta:
									</span>
									<span className="ml-2 font-medium text-foreground">
                    ${sellingPrice.toFixed(2)}
									</span>
								</div>
							</div>

							{/* FA3: Warning if cost > selling price */}
							{!isProfitable && (
								<div className="mt-4 p-4 bg-white rounded-lg border border-[#D4816A]">
									<div className="flex items-start gap-3">
										<AlertTriangle className="w-5 h-5 text-[#D4816A] mt-0.5" />
										<div>
											<p className="font-medium text-[#D4816A] mb-1">
                        Alerta de rentabilidad
											</p>
											<p className="text-sm text-foreground">
                        El costo por unidad (${costPerUnit.toFixed(2)}) supera
                        el precio de venta actual (${sellingPrice.toFixed(2)}).
                        Se recomienda ajustar las tarifas o el precio de venta.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="ml-6">
							<div
								className={`w-24 h-24 rounded-full flex items-center justify-center ${
									isProfitable
										? "bg-[#A8C5A0]/20"
										: "bg-[#D4816A]/20"
								}`}
							>
								<TrendingUp
									className={`w-12 h-12 ${
										isProfitable
											? "text-[#A8C5A0]"
											: "text-[#D4816A]"
									}`}
									strokeWidth={1.5}
								/>
							</div>
						</div>
					</div>
				</Card>

				{/* Breakdown Details */}
				<Card className="p-6 mb-8 shadow-sm border-[1.5px]">
					<h3 className="text-lg font-semibold text-foreground mb-4">
            Detalles del costeo
					</h3>
					<div className="space-y-3">
						<div className="flex justify-between items-center pb-3 border-b border-border">
							<span className="text-sm text-foreground">Ingredientes base</span>
							<span className="font-medium text-foreground">
                ${ingredients.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between items-center pb-3 border-b border-border">
							<span className="text-sm text-foreground">Agua (incluye 15% adicional)</span>
							<span className="font-medium text-foreground">
                ${water.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between items-center pb-3 border-b border-border">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">Gas</span>
								<span className="text-xs text-muted-foreground italic">
                  (requiere tiempo de horneado)
								</span>
							</div>
							<span className="text-sm text-muted-foreground">
                $0.00
							</span>
						</div>
						<div className="flex justify-between items-center pb-3 border-b border-border">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">Electricidad</span>
								<span className="text-xs text-muted-foreground italic">
                  (no configurado)
								</span>
							</div>
							<span className="text-sm text-muted-foreground">
                $0.00
							</span>
						</div>
						<div className="flex justify-between items-center pt-2">
							<span className="font-semibold text-foreground">Total</span>
							<span className="text-xl font-bold text-foreground">
                ${total.toFixed(2)}
							</span>
						</div>
					</div>
				</Card>

				{/* Action Buttons */}
				<div className="flex gap-4 justify-end">
					<Button
						variant="outline"
						size="lg"
						asChild
						className="border-[#8B6F4E] text-[#8B6F4E] hover:bg-[#8B6F4E]/10"
					>
						<Link href="/configuracion">Ajustar tarifas</Link>
					</Button>
					<Button
						size="lg"
						className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-8"
					>
            Aprobar costeo
					</Button>
				</div>
			</div>
		</div>
	);
}

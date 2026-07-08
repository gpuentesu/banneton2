"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ProductionReportRow {
  id_reporte: number;
  identificador_lote: string;
  fecha_produccion: string;
  hora_produccion: string;
  cantidad_producida: string;
  unidad_medida: string;
  observaciones: string | null;
  receta_subreceta?: {
    catalogo_componente?: { nombre: string | null } | null;
  } | null;
  responsable?: { nombre_usuario: string; apellido_usuario: string | null } | null;
  supervisor?: { nombre_usuario: string; apellido_usuario: string | null } | null;
  tanda_produccion?: { numero_tanda: number; cantidad: string }[];
}

function formatFecha(fecha: string, hora: string) {
	const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "UTC",
	});
	const horaFormateada = new Date(hora).toLocaleTimeString("es-CO", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
	});
	return `${fechaFormateada} — ${horaFormateada}`;
}

function nombreCompleto(persona?: { nombre_usuario: string; apellido_usuario: string | null } | null) {
	if (!persona) {return "—";}
	return [persona.nombre_usuario, persona.apellido_usuario].filter(Boolean).join(" ");
}

export default function ProduccionPage() {
	const [reportes, setReportes] = useState<ProductionReportRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelado = false;

		async function cargarHistorial() {
			try {
				const response = await fetch("/api/produccion/reportes");
				const body = await response.json();
				if (!response.ok || !body.ok) {
					throw new Error(body.error || "No se pudo cargar el historial de producción");
				}
				if (!cancelado) {setReportes(body.data);}
			} catch (err) {
				if (!cancelado) {setError(err instanceof Error ? err.message : "Error desconocido");}
			} finally {
				if (!cancelado) {setLoading(false);}
			}
		}

		cargarHistorial();
		return () => {
			cancelado = true;
		};
	}, []);

	return (
		<div className="min-h-screen p-8 bg-background">
			<div className="max-w-6xl mx-auto">
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/produccion">Producción</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Historial de reportes</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="flex items-start justify-between mb-8">
					<div>
						<h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
							<ClipboardList className="w-7 h-7 text-[#8B6F4E]" strokeWidth={1.5} />
              Historial de producción
						</h1>
						<p className="text-sm text-muted-foreground">
              Reportes generados por lote, con fecha, cantidad y personal responsable
						</p>
					</div>
					<Link href="/produccion/nuevo">
						<Button size="lg" className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white">
							<Plus className="w-5 h-5 mr-2" />
              Generar reporte
						</Button>
					</Link>
				</div>

				{loading && (
					<Card className="p-12 text-center text-muted-foreground shadow-sm border-[1.5px]">
            Cargando historial de producción...
					</Card>
				)}

				{!loading && error && (
					<Card className="p-6 border-[1.5px] border-[#D4816A] bg-[#D4816A]/5 text-[#D4816A]">
						{error}
					</Card>
				)}

				{!loading && !error && reportes.length === 0 && (
					<Card className="p-12 text-center shadow-sm border-[1.5px]">
						<PackageSearch className="w-10 h-10 mx-auto mb-4 text-muted-foreground" strokeWidth={1.5} />
						<p className="text-foreground font-medium mb-1">Aún no hay reportes de producción</p>
						<p className="text-sm text-muted-foreground">
              Genera el primer reporte desde una sesión de producción activa
						</p>
					</Card>
				)}

				{!loading && !error && reportes.length > 0 && (
					<Card className="overflow-hidden shadow-sm border-[1.5px]">
						<div className="grid grid-cols-[1fr_1.4fr_1.4fr_1fr_1.2fr_1.2fr] bg-[#FDF6EE] border-b border-border px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
							<span>Lote</span>
							<span>Receta</span>
							<span>Fecha y hora</span>
							<span>Cantidad</span>
							<span>Responsable</span>
							<span>Supervisado por</span>
						</div>
						{reportes.map((reporte) => (
							<div
								key={reporte.id_reporte}
								className="grid grid-cols-[1fr_1.4fr_1.4fr_1fr_1.2fr_1.2fr] px-6 py-4 border-b border-border last:border-b-0 items-center hover:bg-[#FDF6EE]/50"
							>
								<Badge variant="outline" className="w-fit border-[#8B6F4E] text-[#8B6F4E]">
									{reporte.identificador_lote}
								</Badge>
								<span className="text-sm text-foreground">
									{reporte.receta_subreceta?.catalogo_componente?.nombre ?? `Receta #${reporte.id_reporte}`}
								</span>
								<span className="text-sm text-muted-foreground">
									{formatFecha(reporte.fecha_produccion, reporte.hora_produccion)}
								</span>
								<span className="text-sm text-foreground">
									{reporte.cantidad_producida} {reporte.unidad_medida}
									{reporte.tanda_produccion && reporte.tanda_produccion.length > 0 && (
										<span className="text-xs text-muted-foreground"> ({reporte.tanda_produccion.length} tandas)</span>
									)}
								</span>
								<span className="text-sm text-foreground">{nombreCompleto(reporte.responsable)}</span>
								<span className="text-sm text-muted-foreground">{nombreCompleto(reporte.supervisor)}</span>
							</div>
						))}
					</Card>
				)}
			</div>
		</div>
	);
}

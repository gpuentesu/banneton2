"use client";

import { useEffect, useState } from "react";
import { CloudSun, Thermometer, Droplets, Mountain, Gauge, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ENVIRONMENT_RANGES, EnvironmentField } from "@/domain/types/environment";
import { isWithinRange } from "@/domain/environmentLogic";

const FIELD_ICONS: Record<EnvironmentField, typeof Thermometer> = {
	temperaturaAmbiente: Thermometer,
	humedadRelativa: Droplets,
	altitud: Mountain,
	presionBarometrica: Gauge,
};

// Orden de despliegue de los campos según el mockup de RF_08.
const FIELD_ORDER: EnvironmentField[] = [
	"temperaturaAmbiente",
	"humedadRelativa",
	"altitud",
	"presionBarometrica",
];

type Values = Record<EnvironmentField, string>;

export default function AmbientePage() {
	const [values, setValues] = useState<Values>({
		temperaturaAmbiente: "22",
		humedadRelativa: "65",
		altitud: "2600",
		presionBarometrica: "748",
	});
	const [ciudadReferencia, setCiudadReferencia] = useState("Bogotá, Colombia");
	const [sincronizacion, setSincronizacion] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		async function cargarVigente() {
			try {
				const res = await fetch("/api/ambiente");
				const body = await res.json();
				if (body.ok && body.data) {
					const d = body.data;
					setValues({
						temperaturaAmbiente: String(d.temperatura_ambiente),
						humedadRelativa: String(d.humedad_relativa),
						altitud: String(d.altitud),
						presionBarometrica: String(d.presion_barometrica),
					});
					setCiudadReferencia(d.ciudad_referencia ?? "");
					setSincronizacion(Boolean(d.sincronizacion_automatica));
				}
			} catch (err) {
				console.error("No se pudo cargar el perfil ambiental vigente", err);
			}
		}
		cargarVigente();
	}, []);

	function handleChange(field: EnvironmentField, value: string) {
		setValues((prev) => ({ ...prev, [field]: value }));

		const range = ENVIRONMENT_RANGES[field];
		const num = parseFloat(value);
		setErrors((prev) => {
			const next = { ...prev };
			if (value.trim() === "" || Number.isNaN(num) || !isWithinRange(field, num)) {
				next[field] = `Debe estar entre ${range.min} y ${range.max} ${range.unit}`;
			} else {
				delete next[field];
			}
			return next;
		});
	}

	async function guardar() {
		// El sistema no permite guardar hasta corregir valores fuera de rango (paso 4).
		if (Object.keys(errors).length > 0) {
			toast.error("Corrige los valores fuera de rango antes de guardar", {
				style: { background: "#D4816A", color: "white", border: "none" },
			});
			return;
		}

		setSaving(true);
		try {
			const res = await fetch("/api/ambiente", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					temperaturaAmbiente: Number(values.temperaturaAmbiente),
					humedadRelativa: Number(values.humedadRelativa),
					altitud: Number(values.altitud),
					presionBarometrica: Number(values.presionBarometrica),
					ciudadReferencia: ciudadReferencia || undefined,
					sincronizacionAutomatica: sincronizacion,
				}),
			});
			const body = await res.json();

			if (!res.ok || !body.ok) {
				const fieldErrors: Record<string, string> = {};
				(body.errors || []).forEach((e: { field: string; message: string }) => {
					fieldErrors[e.field] = e.message;
				});
				setErrors(fieldErrors);
				toast.error("Revisa los campos marcados", {
					description: body.error || "Las variables no pudieron guardarse",
					style: { background: "#D4816A", color: "white", border: "none" },
				});
				return;
			}

			toast.success("Parámetros guardados exitosamente", {
				description: "Las recetas serán recalculadas con los nuevos valores",
				style: { background: "#A8C5A0", color: "#3D3229", border: "none" },
			});
		} catch (err) {
			console.error(err);
			toast.error("No se pudieron guardar las variables ambientales", {
				style: { background: "#D4816A", color: "white", border: "none" },
			});
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-screen p-8 bg-background">
			<Toaster />
			<div className="max-w-4xl mx-auto">
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/ambiente">Ambiente</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Variables geográficas y ambientales</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
						<CloudSun className="w-7 h-7 text-[#8B6F4E]" strokeWidth={1.5} />
						Variables geográficas y ambientales
					</h1>
					<p className="text-sm text-muted-foreground">
						Ajusta las cantidades de ingredientes sensibles a las condiciones del taller
					</p>
				</div>

				{/* Condiciones ambientales */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Condiciones ambientales</h2>
					<div className="grid grid-cols-2 gap-6">
						{FIELD_ORDER.map((field) => {
							const range = ENVIRONMENT_RANGES[field];
							const Icon = FIELD_ICONS[field];
							return (
								<div key={field}>
									<Label htmlFor={field} className="flex items-center gap-2">
										<Icon className="w-4 h-4 text-[#8B6F4E]" strokeWidth={1.5} />
										{range.label} ({range.unit})
									</Label>
									<Input
										id={field}
										type="number"
										step="0.01"
										value={values[field]}
										onChange={(e) => handleChange(field, e.target.value)}
										className={`mt-2 ${errors[field] ? "border-[#D4816A] border-2" : ""}`}
									/>
									{errors[field] ? (
										<p className="text-sm text-[#D4816A] mt-1">{errors[field]}</p>
									) : (
										<p className="text-xs text-muted-foreground mt-1">
											Rango: {range.min} a {range.max} {range.unit}
										</p>
									)}
								</div>
							);
						})}
					</div>
				</Card>

				{/* Ubicación de referencia */}
				<Card className="p-6 mb-8 bg-white shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Ubicación de referencia</h2>
					<div className="mb-4">
						<Label htmlFor="ciudad">Ciudad / taller</Label>
						<Input
							id="ciudad"
							value={ciudadReferencia}
							onChange={(e) => setCiudadReferencia(e.target.value)}
							maxLength={100}
							placeholder="Ej. Bogotá, Colombia"
							className="mt-2"
						/>
					</div>
					<div className="flex items-center justify-between rounded-lg bg-[#FDF6EE] px-4 py-3">
						<div>
							<p className="text-sm font-medium text-foreground">Sincronización automática</p>
							<p className="text-xs text-muted-foreground">Actualizar desde geolocalización (RNF_18)</p>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked={sincronizacion}
							onClick={() => setSincronizacion((v) => !v)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								sincronizacion ? "bg-[#8B6F4E]" : "bg-muted-foreground/30"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									sincronizacion ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</Card>

				<div className="flex items-center justify-end gap-4">
					<Badge variant="outline" className="border-[#A8C5A0] text-[#5F7A57]">
						Se usará para el recálculo de recetas
					</Badge>
					<Button
						size="lg"
						disabled={saving || Object.keys(errors).length > 0}
						onClick={guardar}
						className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-8"
					>
						<Save className="w-5 h-5 mr-2" />
						{saving ? "Guardando..." : "Guardar parámetros"}
					</Button>
				</div>
			</div>
		</div>
	);
}

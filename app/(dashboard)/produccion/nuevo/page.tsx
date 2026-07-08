"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, X } from "lucide-react";
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
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface RecetaOption {
  idComponente: number;
  nombre: string;
}

interface UsuarioOption {
  id_usuario: number;
  nombre_usuario: string;
  apellido_usuario: string | null;
  rol: { nombre_rol: string };
}

interface TandaForm {
  numeroTanda: number;
  cantidad: string;
}

function ahoraFecha() {
	return new Date().toISOString().slice(0, 10);
}

function ahoraHora() {
	const now = new Date();
	return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function NuevoReporteProduccionPage() {
	const router = useRouter();

	const [recetas, setRecetas] = useState<RecetaOption[]>([]);
	const [usuarios, setUsuarios] = useState<UsuarioOption[]>([]);

	const [idReceta, setIdReceta] = useState<string>("");
	const [identificadorLote, setIdentificadorLote] = useState<string>("");
	const [fechaProduccion, setFechaProduccion] = useState(ahoraFecha());
	const [horaProduccion, setHoraProduccion] = useState(ahoraHora());
	const [cantidadProducida, setCantidadProducida] = useState<string>("");
	const [unidadMedida, setUnidadMedida] = useState<"unidades" | "kg">("unidades");
	const [tandas, setTandas] = useState<TandaForm[]>([]);
	const [idResponsable, setIdResponsable] = useState<string>("");
	const [idSupervisor, setIdSupervisor] = useState<string>("");
	const [observaciones, setObservaciones] = useState<string>("");

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		async function cargarDatosIniciales() {
			try {
				const [recetasRes, usuariosRes, loteRes] = await Promise.all([
					fetch("/api/scale1"),
					fetch("/api/usuarios"),
					fetch("/api/produccion/lote-sugerido"),
				]);

				const recetasBody = await recetasRes.json();
				setRecetas(Array.isArray(recetasBody) ? recetasBody : []);

				const usuariosBody = await usuariosRes.json();
				if (usuariosBody.ok) {setUsuarios(usuariosBody.data);}

				const loteBody = await loteRes.json();
				if (loteBody.ok) {setIdentificadorLote(loteBody.data.identificadorLote);}
			} catch (err) {
				console.error("No se pudieron cargar los datos iniciales del formulario", err);
			}
		}

		cargarDatosIniciales();
	}, []);

	const cantidadTandas = useMemo(
		() => tandas.reduce((sum, t) => sum + (parseFloat(t.cantidad) || 0), 0),
		[tandas],
	);

	const recetaSeleccionada = recetas.find((r) => String(r.idComponente) === idReceta);
	const responsableSeleccionado = usuarios.find((u) => String(u.id_usuario) === idResponsable);

	function agregarTanda() {
		setTandas((prev) => [...prev, { numeroTanda: prev.length + 1, cantidad: "" }]);
	}

	function eliminarTanda(index: number) {
		setTandas((prev) =>
			prev.filter((_, i) => i !== index).map((t, i) => ({ ...t, numeroTanda: i + 1 })),
		);
	}

	function actualizarTanda(index: number, cantidad: string) {
		setTandas((prev) => prev.map((t, i) => (i === index ? { ...t, cantidad } : t)));
	}

	async function guardarReporte() {
		setSaving(true);
		setErrors({});

		try {
			const response = await fetch("/api/produccion/reportes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					idReceta: Number(idReceta),
					identificadorLote: identificadorLote || undefined,
					fechaProduccion,
					horaProduccion,
					cantidadProducida: Number(cantidadProducida),
					unidadMedida,
					idResponsable: Number(idResponsable),
					idSupervisor: idSupervisor ? Number(idSupervisor) : undefined,
					observaciones: observaciones || undefined,
					tandas: tandas.length > 0
						? tandas.map((t) => ({ numeroTanda: t.numeroTanda, cantidad: Number(t.cantidad) }))
						: undefined,
				}),
			});

			const body = await response.json();

			if (!response.ok || !body.ok) {
				const fieldErrors: Record<string, string> = {};
				(body.errors || []).forEach((e: { field: string; message: string }) => {
					fieldErrors[e.field] = e.message;
				});
				setErrors(fieldErrors);
				toast.error("Revisa los campos marcados", {
					description: body.error || "El reporte no pudo guardarse",
					style: { background: "#D4816A", color: "white", border: "none" },
				});
				return;
			}

			toast.success("Reporte guardado correctamente", {
				description: `Lote ${body.data.identificador_lote} registrado en el historial`,
				style: { background: "#A8C5A0", color: "#3D3229", border: "none" },
			});
			router.push("/produccion");
		} catch (err) {
			console.error(err);
			toast.error("No se pudo guardar el reporte", {
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
							<BreadcrumbLink href="/produccion">Producción</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Generar reporte</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-foreground mb-2">Generar reporte de producción</h1>
					<p className="text-sm text-muted-foreground">
            Consolida fecha, lote, cantidad y personal responsable de la sesión de producción
					</p>
				</div>

				{/* Identificación del lote */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Identificación del lote</h2>
					<div className="grid grid-cols-2 gap-6">
						<div>
							<Label htmlFor="lote">Identificador de lote</Label>
							<Input id="lote" value={identificadorLote} disabled className="mt-2 bg-muted/50" />
							<Badge variant="outline" className="mt-2 text-xs border-[#A8C5A0] text-[#5F7A57]">
                Generado automáticamente
							</Badge>
						</div>
						<div>
							<Label htmlFor="receta">Receta</Label>
							<Select value={idReceta} onValueChange={setIdReceta}>
								<SelectTrigger id="receta" className={`mt-2 ${errors.idReceta ? "border-[#D4816A] border-2" : ""}`}>
									<SelectValue placeholder="Selecciona la receta activa" />
								</SelectTrigger>
								<SelectContent>
									{recetas.map((r) => (
										<SelectItem key={r.idComponente} value={String(r.idComponente)}>
											{r.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.idReceta && <p className="text-sm text-[#D4816A] mt-1">{errors.idReceta}</p>}
						</div>
						<div>
							<Label htmlFor="fecha">Fecha de producción</Label>
							<Input
								id="fecha"
								type="date"
								value={fechaProduccion}
								onChange={(e) => setFechaProduccion(e.target.value)}
								className={`mt-2 ${errors.fechaProduccion ? "border-[#D4816A] border-2" : ""}`}
							/>
							{errors.fechaProduccion && <p className="text-sm text-[#D4816A] mt-1">{errors.fechaProduccion}</p>}
						</div>
						<div>
							<Label htmlFor="hora">Hora de inicio</Label>
							<Input
								id="hora"
								type="time"
								value={horaProduccion}
								onChange={(e) => setHoraProduccion(e.target.value)}
								className={`mt-2 ${errors.horaProduccion ? "border-[#D4816A] border-2" : ""}`}
							/>
							{errors.horaProduccion && <p className="text-sm text-[#D4816A] mt-1">{errors.horaProduccion}</p>}
						</div>
					</div>
				</Card>

				{/* Producción */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Producción</h2>
					<div className="grid grid-cols-2 gap-6 mb-6">
						<div>
							<Label htmlFor="cantidad">Cantidad producida</Label>
							<Input
								id="cantidad"
								type="number"
								min="0"
								step="0.01"
								value={cantidadProducida}
								onChange={(e) => setCantidadProducida(e.target.value)}
								className={`mt-2 ${errors.cantidadProducida ? "border-[#D4816A] border-2" : ""}`}
							/>
							{errors.cantidadProducida && <p className="text-sm text-[#D4816A] mt-1">{errors.cantidadProducida}</p>}
						</div>
						<div>
							<Label htmlFor="unidad">Unidad</Label>
							<Select value={unidadMedida} onValueChange={(v) => setUnidadMedida(v as "unidades" | "kg")}>
								<SelectTrigger id="unidad" className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="unidades">Unidades</SelectItem>
									<SelectItem value="kg">Kilogramos</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex items-center justify-between mb-3">
						<Label>Tandas de horneado (opcional)</Label>
						<Button variant="outline" size="sm" onClick={agregarTanda} className="border-[#8B6F4E] text-[#8B6F4E]">
							<Plus className="w-4 h-4 mr-1" />
              Agregar tanda
						</Button>
					</div>
					{tandas.length > 0 && (
						<div className="space-y-2">
							{tandas.map((tanda, index) => (
								<div key={index} className="flex items-center gap-3">
									<span className="text-sm text-muted-foreground w-20 shrink-0">Tanda {tanda.numeroTanda}</span>
									<Input
										type="number"
										min="0"
										step="0.01"
										value={tanda.cantidad}
										onChange={(e) => actualizarTanda(index, e.target.value)}
										placeholder="Cantidad"
									/>
									<Button variant="outline" size="icon" onClick={() => eliminarTanda(index)} className="shrink-0">
										<Trash2 className="w-4 h-4 text-[#D4816A]" />
									</Button>
								</div>
							))}
							<p className="text-xs text-muted-foreground">
                Suma de tandas: {cantidadTandas}
								{cantidadProducida && Math.abs(cantidadTandas - Number(cantidadProducida)) > 0.01 && (
									<span className="text-[#D4816A]"> — no coincide con la cantidad producida</span>
								)}
							</p>
						</div>
					)}
					{errors.tandas && <p className="text-sm text-[#D4816A] mt-2">{errors.tandas}</p>}
				</Card>

				{/* Personal responsable */}
				<Card className="p-6 mb-6 bg-white shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Personal responsable</h2>
					<div className="grid grid-cols-2 gap-6 mb-4">
						<div>
							<Label htmlFor="responsable">Panadero responsable</Label>
							<Select value={idResponsable} onValueChange={setIdResponsable}>
								<SelectTrigger id="responsable" className={`mt-2 ${errors.idResponsable ? "border-[#D4816A] border-2" : ""}`}>
									<SelectValue placeholder="Selecciona el responsable" />
								</SelectTrigger>
								<SelectContent>
									{usuarios.map((u) => (
										<SelectItem key={u.id_usuario} value={String(u.id_usuario)}>
											{u.nombre_usuario} {u.apellido_usuario ?? ""} · {u.rol.nombre_rol}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.idResponsable && <p className="text-sm text-[#D4816A] mt-1">{errors.idResponsable}</p>}
						</div>
						<div>
							<Label htmlFor="supervisor">Supervisado por (opcional)</Label>
							<Select value={idSupervisor} onValueChange={setIdSupervisor}>
								<SelectTrigger id="supervisor" className="mt-2">
									<SelectValue placeholder="Sin supervisor" />
								</SelectTrigger>
								<SelectContent>
									{usuarios.map((u) => (
										<SelectItem key={u.id_usuario} value={String(u.id_usuario)}>
											{u.nombre_usuario} {u.apellido_usuario ?? ""} · {u.rol.nombre_rol}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<Label htmlFor="observaciones">Observaciones (opcional)</Label>
					<textarea
						id="observaciones"
						value={observaciones}
						onChange={(e) => setObservaciones(e.target.value)}
						rows={3}
						maxLength={500}
						className="mt-2 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
						placeholder="Ej. Amasado extendido 2 min extra por alta temperatura del taller"
					/>
				</Card>

				{/* Resumen */}
				<Card className="p-6 mb-8 bg-[#FDF6EE] shadow-sm border-[1.5px]">
					<h2 className="text-lg font-semibold text-foreground mb-4">Resumen del reporte</h2>
					<dl className="grid grid-cols-2 gap-y-2 text-sm">
						<dt className="text-muted-foreground">Lote</dt>
						<dd className="text-foreground font-medium">{identificadorLote || "—"}</dd>
						<dt className="text-muted-foreground">Receta</dt>
						<dd className="text-foreground font-medium">{recetaSeleccionada?.nombre ?? "—"}</dd>
						<dt className="text-muted-foreground">Fecha y hora</dt>
						<dd className="text-foreground font-medium">{fechaProduccion} — {horaProduccion}</dd>
						<dt className="text-muted-foreground">Cantidad</dt>
						<dd className="text-foreground font-medium">
							{cantidadProducida || "0"} {unidadMedida}
							{tandas.length > 0 && ` (${tandas.length} tandas)`}
						</dd>
						<dt className="text-muted-foreground">Responsable</dt>
						<dd className="text-foreground font-medium">
							{responsableSeleccionado ? `${responsableSeleccionado.nombre_usuario} ${responsableSeleccionado.apellido_usuario ?? ""}` : "—"}
						</dd>
					</dl>
				</Card>

				<div className="flex gap-4 justify-end">
					<Button variant="outline" size="lg" onClick={() => router.push("/produccion")}>
						<X className="w-5 h-5 mr-2" />
            Cancelar
					</Button>
					<Button
						size="lg"
						disabled={saving}
						onClick={guardarReporte}
						className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white px-8"
					>
						<Save className="w-5 h-5 mr-2" />
						{saving ? "Guardando..." : "Guardar reporte"}
					</Button>
				</div>
			</div>
		</div>
	);
}

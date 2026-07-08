"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Play, RotateCcw, CheckCircle2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface ChecklistItem {
  id_item: number;
  tipo: "ingrediente" | "paso";
  descripcion: string;
  cantidad: string | null;
  unidad_medida: string | null;
  orden: number;
  completado: boolean;
  completado_en: string | null;
}

interface Progreso {
  total: number;
  completados: number;
  pendientes: number;
  porcentaje: number;
  procesoCompleto: boolean;
}

interface WorkshopSession {
  id_sesion: number;
  identificador_lote: string | null;
  estado: string;
  receta_subreceta?: { catalogo_componente?: { nombre: string | null } | null } | null;
  items: ChecklistItem[];
  progreso: Progreso;
}

function formatHora(iso: string | null) {
	if (!iso) {return "";}
	return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function TallerPage() {
	const [recetas, setRecetas] = useState<RecetaOption[]>([]);
	const [idReceta, setIdReceta] = useState<string>("");
	const [pasosTexto, setPasosTexto] = useState<string>("");
	const [session, setSession] = useState<WorkshopSession | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function cargarRecetas() {
			try {
				const res = await fetch("/api/scale1");
				const body = await res.json();
				setRecetas(Array.isArray(body) ? body : []);
			} catch (err) {
				console.error("No se pudieron cargar las recetas", err);
			}
		}
		cargarRecetas();
	}, []);

	const nombreReceta = session?.receta_subreceta?.catalogo_componente?.nombre ?? "Receta";
	const ingredientes = useMemo(() => session?.items.filter((i) => i.tipo === "ingrediente") ?? [], [session]);
	const pasos = useMemo(() => session?.items.filter((i) => i.tipo === "paso") ?? [], [session]);

	async function iniciarSesion() {
		if (!idReceta) {
			toast.error("Selecciona una receta para ejecutar", {
				style: { background: "#D4816A", color: "white", border: "none" },
			});
			return;
		}
		setLoading(true);
		try {
			const pasosLista = pasosTexto
				.split("\n")
				.map((p) => p.trim())
				.filter(Boolean);

			const res = await fetch("/api/taller", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					idReceta: Number(idReceta),
					pasos: pasosLista.length > 0 ? pasosLista : undefined,
				}),
			});
			const body = await res.json();

			if (!res.ok || !body.ok) {
				toast.error(body.errors?.[0]?.message || body.error || "No se pudo iniciar la sesión", {
					style: { background: "#D4816A", color: "white", border: "none" },
				});
				return;
			}

			// Recuperamos la sesión con su progreso calculado.
			await cargarSesion(body.data.id_sesion);
		} catch (err) {
			console.error(err);
			toast.error("No se pudo iniciar la sesión de taller", {
				style: { background: "#D4816A", color: "white", border: "none" },
			});
		} finally {
			setLoading(false);
		}
	}

	async function cargarSesion(idSesion: number) {
		const res = await fetch(`/api/taller/${idSesion}`);
		const body = await res.json();
		if (body.ok) {setSession(body.data);}
	}

	async function toggleItem(item: ChecklistItem) {
		if (!session) {return;}
		try {
			const res = await fetch(`/api/taller/${session.id_sesion}/items/${item.id_item}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completado: !item.completado }),
			});
			const body = await res.json();
			if (!res.ok || !body.ok) {
				toast.error(body.error || "No se pudo actualizar el ítem", {
					style: { background: "#D4816A", color: "white", border: "none" },
				});
				return;
			}

			const previoCompleto = session.progreso.procesoCompleto;
			setSession(body.data);

			if (body.data.progreso.procesoCompleto && !previoCompleto) {
				toast.success("¡Proceso completado!", {
					description: "Todos los ingredientes y pasos han sido verificados",
					style: { background: "#A8C5A0", color: "#3D3229", border: "none" },
				});
			}
		} catch (err) {
			console.error(err);
			toast.error("No se pudo actualizar el ítem", {
				style: { background: "#D4816A", color: "white", border: "none" },
			});
		}
	}

	function reiniciar() {
		setSession(null);
		setIdReceta("");
		setPasosTexto("");
	}

	// ---------- Vista: selección de receta ----------
	if (!session) {
		return (
			<div className="min-h-screen p-8 bg-background">
				<Toaster />
				<div className="max-w-3xl mx-auto">
					<Breadcrumb className="mb-6">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/taller">Modo Taller</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Nueva sesión</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
							<ClipboardCheck className="w-7 h-7 text-[#8B6F4E]" strokeWidth={1.5} />
							Modo Taller
						</h1>
						<p className="text-sm text-muted-foreground">
							Selecciona la receta a ejecutar para generar su lista de verificación de ingredientes y pasos
						</p>
					</div>

					<Card className="p-6 bg-white shadow-sm border-[1.5px]">
						<div className="mb-6">
							<Label htmlFor="receta">Receta a ejecutar</Label>
							<Select value={idReceta} onValueChange={setIdReceta}>
								<SelectTrigger id="receta" className="mt-2">
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
						</div>

						<div className="mb-6">
							<Label htmlFor="pasos">Pasos del proceso (opcional, uno por línea)</Label>
							<textarea
								id="pasos"
								value={pasosTexto}
								onChange={(e) => setPasosTexto(e.target.value)}
								rows={5}
								className="mt-2 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
								placeholder={"Mezcla inicial (amasado 5 min)\nIncorporar mantequilla poco a poco\nReposo en bloque — 1 h a 24 °C"}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Los ingredientes se cargan automáticamente desde la formulación de la receta.
							</p>
						</div>

						<Button
							size="lg"
							disabled={loading}
							onClick={iniciarSesion}
							className="bg-[#8B6F4E] hover:bg-[#7A5F42] text-white w-full"
						>
							<Play className="w-5 h-5 mr-2" />
							{loading ? "Cargando..." : "Iniciar sesión de taller"}
						</Button>
					</Card>
				</div>
			</div>
		);
	}

	// ---------- Vista: checklist ----------
	const { progreso } = session;

	return (
		<div className="min-h-screen p-8 bg-background">
			<Toaster />
			<div className="max-w-3xl mx-auto">
				<div className="flex items-start justify-between mb-6">
					<div>
						<h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
							<ClipboardCheck className="w-6 h-6 text-[#8B6F4E]" strokeWidth={1.5} />
							{nombreReceta}
							{session.identificador_lote && (
								<span className="text-muted-foreground font-normal">— {session.identificador_lote}</span>
							)}
						</h1>
					</div>
					<div className="flex items-center gap-3">
						<Badge className="bg-[#E8B86D]/20 text-[#8B6F4E] border-none">Modo taller</Badge>
						<Button variant="outline" size="sm" onClick={reiniciar}>
							<RotateCcw className="w-4 h-4 mr-1" />
							Otra sesión
						</Button>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 mb-4">
					<Card className="p-4 text-center bg-white shadow-sm border-[1.5px]">
						<p className="text-2xl font-semibold text-[#5B8AC5]">{progreso.completados}</p>
						<p className="text-xs text-muted-foreground uppercase tracking-wide">Completados</p>
					</Card>
					<Card className="p-4 text-center bg-white shadow-sm border-[1.5px]">
						<p className="text-2xl font-semibold text-[#D4816A]">{progreso.pendientes}</p>
						<p className="text-xs text-muted-foreground uppercase tracking-wide">Pendientes</p>
					</Card>
					<Card className="p-4 text-center bg-white shadow-sm border-[1.5px]">
						<p className="text-2xl font-semibold text-foreground">{progreso.total}</p>
						<p className="text-xs text-muted-foreground uppercase tracking-wide">Total ítems</p>
					</Card>
				</div>

				{/* Progreso */}
				<div className="mb-6">
					<div className="flex items-center justify-between text-sm mb-1">
						<span className="text-muted-foreground">Progreso</span>
						<span className="font-medium text-foreground">{progreso.porcentaje}%</span>
					</div>
					<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
						<div
							className="h-full bg-[#5B8AC5] transition-all"
							style={{ width: `${progreso.porcentaje}%` }}
						/>
					</div>
				</div>

				{progreso.procesoCompleto && (
					<Card className="p-4 mb-6 border-[1.5px] border-[#A8C5A0] bg-[#A8C5A0]/10 flex items-center gap-3">
						<CheckCircle2 className="w-5 h-5 text-[#5F7A57]" />
						<p className="text-sm text-[#3D3229] font-medium">El proceso ha sido completado.</p>
					</Card>
				)}

				{/* Ingredientes */}
				{ingredientes.length > 0 && (
					<>
						<h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ingredientes</h2>
						<Card className="mb-6 overflow-hidden shadow-sm border-[1.5px]">
							{ingredientes.map((item) => (
								<ChecklistRow key={item.id_item} item={item} onToggle={() => toggleItem(item)} />
							))}
						</Card>
					</>
				)}

				{/* Proceso */}
				{pasos.length > 0 && (
					<>
						<h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Proceso</h2>
						<Card className="overflow-hidden shadow-sm border-[1.5px]">
							{pasos.map((item) => (
								<ChecklistRow key={item.id_item} item={item} onToggle={() => toggleItem(item)} />
							))}
						</Card>
					</>
				)}
			</div>
		</div>
	);
}

function ChecklistRow({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-[#FDF6EE]/50 text-left"
		>
			<span
				className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
					item.completado ? "bg-[#5B8AC5] border-[#5B8AC5]" : "border-muted-foreground/40"
				}`}
			>
				{item.completado && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
			</span>
			<span className={`flex-1 text-sm ${item.completado ? "line-through text-muted-foreground" : "text-foreground"}`}>
				{item.descripcion}
			</span>
			{item.cantidad != null && (
				<span className="text-sm text-muted-foreground shrink-0">
					{item.cantidad} {item.unidad_medida ?? ""}
				</span>
			)}
			<span className="text-xs text-muted-foreground w-12 text-right shrink-0">{formatHora(item.completado_en)}</span>
		</button>
	);
}

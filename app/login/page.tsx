import { ejecutarLogin } from "../api/login/login";

interface PageProps {
	searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
	const paramsBusqueda = await searchParams;
	const mensajeError = paramsBusqueda.error === "invalid"
		? "El correo electrónico o la contraseña son incorrectos."
		: paramsBusqueda.error === "no-autorizado"
			? "No tienes permisos para acceder a esa sección."
			: null;

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 p-4">
			<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-zinc-200">
				<h1 className="text-3xl font-extrabold text-center text-amber-800 mb-2 tracking-tight">
					🥖 Banneton Control
				</h1>
				<p className="text-sm text-zinc-500 text-center mb-8">
					Calculadora Automatizada y Gestión de Producción Real
				</p>

				{mensajeError && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
						{mensajeError}
					</div>
				)}

				<form action={ejecutarLogin} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-2">
							Correo Electrónico
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							placeholder="nombre@panaderia.com"
							className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-semibold text-zinc-700 mb-2">
							Contraseña
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							placeholder="••••••••"
							className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold p-3 rounded-lg transition-all duration-200 shadow-md cursor-pointer text-center"
					>
						Ingresar al Sistema
					</button>
				</form>
			</div>
		</div>
	);
}

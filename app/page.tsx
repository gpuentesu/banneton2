export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          🛒 Banetton
        </h1>
        <p className="text-gray-400 text-lg">
          API REST con Next.js · Prisma · Supabase PostgreSQL
        </p>
        <div className="bg-gray-800 rounded-xl p-6 text-left space-y-3 text-sm font-mono">
          <p className="text-green-400">✓ Next.js App Router activo</p>
          <p className="text-green-400">✓ Prisma ORM configurado</p>
          <p className="text-green-400">✓ Supabase PostgreSQL conectado</p>
          <p className="text-blue-400 mt-4">GET  /api/roles</p>
          <p className="text-blue-400">POST /api/roles</p>
        </div>
        <a
          href="/api/roles"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition"
        >
          Ver roles →
        </a>
      </div>
    </main>
  );
}

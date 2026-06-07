#!/usr/bin/env bash
# =============================================================
# setup.sh — Banneton · Preparación inicial del proyecto
# Universidad Nacional de Colombia · Ingeniería de Software
# =============================================================
# Uso: bash setup.sh
# Requisitos: Node.js 18+, npm, Docker, Docker Compose
# =============================================================

set -e  # Detener si algún comando falla

# ── 1. Verificar dependencias del sistema ────────────────────
echo "Verificando dependencias..."
command -v node   >/dev/null 2>&1 || { echo "Error: Node.js no instalado"; exit 1; }
command -v npm    >/dev/null 2>&1 || { echo "Error: npm no instalado"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Error: Docker no instalado"; exit 1; }
echo "  OK — Node $(node -v) · npm $(npm -v) · Docker $(docker --version | cut -d' ' -f3)"

# ── 2. Instalar dependencias de Node ─────────────────────────
echo "Instalando dependencias npm..."
npm install
echo "  OK — dependencias instaladas"

# ── 3. Copiar variables de entorno si no existen ─────────────
echo "Configurando variables de entorno..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  AVISO: .env creado desde .env.example — configura DATABASE_URL antes de continuar"
else
  echo "  OK — .env ya existe"
fi

# ── 4. Levantar base de datos en Docker ──────────────────────
echo "Levantando base de datos PostgreSQL en Docker..."
docker compose up -d postgres
echo "  OK — contenedor banneton_db iniciado"

# ── 5. Esperar a que Postgres esté listo ─────────────────────
echo "Esperando a que PostgreSQL esté disponible..."
sleep 4
docker compose exec postgres pg_isready -U postgres
echo "  OK — PostgreSQL listo"

# ── 6. Aplicar migraciones de Prisma ─────────────────────────
echo "Aplicando migraciones de base de datos (Prisma)..."
npx prisma migrate dev --name init
echo "  OK — migraciones aplicadas"

# ── 7. Generar cliente Prisma ─────────────────────────────────
echo "Generando cliente Prisma..."
npx prisma generate
echo "  OK — cliente generado"

# ── 8. Ejecutar pruebas básicas ───────────────────────────────
echo "Ejecutando pruebas básicas..."
npm run build 2>&1 | tail -5
echo "  OK — build exitoso"

# ── 9. Listo ─────────────────────────────────────────────────
echo ""
echo "============================================="
echo "  Banneton listo para desarrollo"
echo "  Inicia el servidor con: npm run dev"
echo "  API disponible en:      http://localhost:3000/api/roles"
echo "============================================="

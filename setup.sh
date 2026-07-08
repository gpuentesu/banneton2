#!/usr/bin/env bash
# =============================================================
# setup.sh — Banneton · Wrapper Docker
# Universidad Nacional de Colombia · Ingeniería de Software
# =============================================================
# Uso: bash setup.sh
# Requisitos: Docker + Docker Compose
# =============================================================

set -e

echo "============================================"
echo "  🥖 Banneton — Inicialización"
echo "============================================"
echo ""

# ── 1. Verificar Docker ──────────────────────────────────────
echo "Verificando Docker..."
command -v docker >/dev/null 2>&1 || { echo "❌ Error: Docker no instalado"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "❌ Error: Docker Compose no disponible"; exit 1; }
echo "  ✅ Docker listo"

# ── 2. Preparar variables de entorno ─────────────────────────
echo ""
echo "Configurando entorno..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  📋 .env creado desde .env.example"
  echo "  ⚠️  AVISO: edita .env si necesitas cambiar la contraseña de PostgreSQL"
else
  echo "  📋 .env ya existe"
fi

# ── 3. Menú interactivo ────────────────────────────────────
echo ""
echo "Selecciona el entorno:"
echo "  1) Desarrollo  — hot-reload, volúmenes locales, logs en vivo"
echo "  2) Producción  — build optimizado, sin volúmenes, en background"
echo ""
read -p "Opción [1/2]: " opcion

case $opcion in
  1)
    echo ""
    echo "🚀 Iniciando en modo DESARROLLO..."
    echo "   🌐 App:     http://localhost:3000"
    echo "   🔌 API:     http://localhost:3000/api/roles"
    echo "   🐘 Postgre:  localhost:5432"
    echo ""
    echo "   Comandos útiles:"
    echo "     Ver logs:  docker compose logs -f app"
    echo "     Detener:   docker compose down"
    echo ""
    docker compose up --build
    ;;
  2)
    echo ""
    echo "🚀 Iniciando en modo PRODUCCIÓN..."
    echo "   🌐 App:     http://localhost:3000"
    echo ""
    docker compose -f docker-compose.prod.yml up --build -d
    echo ""
    echo "✅ Contenedores en background."
    echo "   Ver logs: docker compose -f docker-compose.prod.yml logs -f"
    echo "   Detener:  docker compose -f docker-compose.prod.yml down"
    ;;
  *)
    echo ""
    echo "❌ Opción inválida. Saliendo."
    exit 1
    ;;
esac

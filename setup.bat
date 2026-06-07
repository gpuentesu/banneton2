@echo off
REM =============================================================
REM setup.bat — Banneton · Preparacion inicial del proyecto
REM Universidad Nacional de Colombia · Ingenieria de Software
REM =============================================================
REM Uso: setup.bat
REM Requisitos: Node.js 18+, npm, Docker Desktop
REM =============================================================

REM ── 1. Verificar dependencias del sistema ────────────────────
echo Verificando dependencias...
node --version >nul 2>&1 || (echo Error: Node.js no instalado & exit /b 1)
npm --version  >nul 2>&1 || (echo Error: npm no instalado & exit /b 1)
docker --version >nul 2>&1 || (echo Error: Docker no instalado & exit /b 1)
echo   OK — dependencias verificadas

REM ── 2. Instalar dependencias de Node ─────────────────────────
echo Instalando dependencias npm...
npm install
echo   OK — dependencias instaladas

REM ── 3. Copiar variables de entorno si no existen ─────────────
echo Configurando variables de entorno...
if not exist .env (
  copy .env.example .env
  echo   AVISO: .env creado desde .env.example — configura DATABASE_URL
) else (
  echo   OK — .env ya existe
)

REM ── 4. Levantar base de datos en Docker ──────────────────────
echo Levantando base de datos PostgreSQL en Docker...
docker compose up -d postgres
echo   OK — contenedor banneton_db iniciado

REM ── 5. Esperar a que Postgres este listo ─────────────────────
echo Esperando 5 segundos para que PostgreSQL inicie...
timeout /t 5 /nobreak >nul
echo   OK — espera completada

REM ── 6. Aplicar migraciones de Prisma ─────────────────────────
echo Aplicando migraciones de base de datos...
npx prisma migrate dev --name init
echo   OK — migraciones aplicadas

REM ── 7. Generar cliente Prisma ────────────────────────────────
echo Generando cliente Prisma...
npx prisma generate
echo   OK — cliente generado

REM ── 8. Build del proyecto ────────────────────────────────────
echo Ejecutando build de verificacion...
npm run build
echo   OK — build exitoso

REM ── 9. Listo ─────────────────────────────────────────────────
echo.
echo =============================================
echo   Banneton listo para desarrollo
echo   Inicia con: npm run dev
echo   API en:     http://localhost:3000/api/roles
echo =============================================

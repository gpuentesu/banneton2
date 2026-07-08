@echo off
REM =============================================================
REM setup.bat — Banneton · Wrapper Docker
REM Universidad Nacional de Colombia · Ingenieria de Software
REM =============================================================
REM Uso: setup.bat
REM Requisitos: Docker Desktop
REM =============================================================

echo ============================================
echo   Banneton — Inicializacion
echo ============================================
echo.

REM ── 1. Verificar Docker ────────────────────────────────────
echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker no instalado
    exit /b 1
)
docker compose version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose no disponible
    exit /b 1
)
echo   OK — Docker listo

REM ── 2. Preparar variables de entorno ───────────────────────
echo.
echo Configurando entorno...
if not exist .env (
    copy .env.example .env
    echo   .env creado desde .env.example
    echo   AVISO: edita .env si necesitas cambiar la contrasena de PostgreSQL
) else (
    echo   .env ya existe
)

REM ── 3. Menu interactivo ────────────────────────────────────
echo.
echo Selecciona el entorno:
echo   1) Desarrollo  — hot-reload, volumenes locales, logs en vivo
echo   2) Produccion  — build optimizado, sin volumenes, en background
echo.
set /p opcion="Opcion [1/2]: "

if "%opcion%"=="1" (
    echo.
    echo Iniciando en modo DESARROLLO...
    echo   App:     http://localhost:3000
    echo   API:     http://localhost:3000/api/roles
    echo   Postgre:  localhost:5432
    echo.
    docker compose up --build
) else if "%opcion%"=="2" (
    echo.
    echo Iniciando en modo PRODUCCION...
    echo   App:     http://localhost:3000
    echo.
    docker compose -f docker-compose.prod.yml up --build -d
    echo.
    echo Contenedores en background.
    echo Ver logs: docker compose -f docker-compose.prod.yml logs -f
    echo Detener:  docker compose -f docker-compose.prod.yml down
) else (
    echo.
    echo Opcion invalida. Saliendo.
    exit /b 1
)

# Banneton — Backend

Repositorio de código fuente (backend + API REST + frontend integrado) del proyecto **Banneton**.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript 5
- **Runtime:** Node.js 24 LTS
- **Package Manager:** pnpm 10.10.0
- **ORM:** Prisma 7 + PostgreSQL
- **Base de datos:** PostgreSQL 16 (Docker local / Supabase)
- **Contenedores:** Docker + Docker Compose

## Requisitos previos

- **Docker** 24+ y Docker Compose
- *(Opcional)* **Node.js 24+** y **pnpm 10.10.0** si prefieres desarrollo local sin Docker

## Primer uso (recomendado: Docker)

```bash
# Clonar
git clone https://github.com/Berry-Team-UNAL/project-backend.git
cd project-backend

# Usar el wrapper interactivo
bash setup.sh        # Linux / macOS
# o
setup.bat            # Windows
```

El wrapper te preguntará:
- **1) Desarrollo:** hot-reload, volúmenes locales, logs en vivo.
- **2) Producción:** build optimizado, contenedores en background.

### Docker directo (alternativa al wrapper)

```bash
# Desarrollo
cp .env.example .env
docker compose up --build

# Producción
docker compose -f docker-compose.prod.yml up --build -d
```

## Desarrollo local (sin Docker para la app)

```bash
# 1. Instalar pnpm (si no lo tienes)
corepack enable && corepack prepare pnpm@10.10.0 --activate

# 2. Instalar dependencias
pnpm install

# 3. Aprobar builds nativos (Prisma, sharp...)
pnpm approve-builds

# 4. Configurar entorno
cp .env.example .env
# Editar .env: DATABASE_URL apuntando a localhost si usas BD local

# 5. Levantar solo PostgreSQL en Docker
docker compose up -d postgres

# 6. Generar Prisma y migrar
npx prisma generate
npx prisma migrate dev --name init

# 7. Iniciar app
pnpm dev
```

## Estructura

```
app/               # Next.js App Router
├── api/roles/     # API REST (entidad Rol)
├── page.tsx       # Página de inicio
lib/               # Utilidades (Prisma singleton)
prisma/            # Esquema de base de datos (17 entidades)
public/            # Assets estáticos
```

## Documentación del proyecto

- Documentos, diagramas y entregas: [`Berry-Team-UNAL/project-docs`](https://github.com/Berry-Team-UNAL/project-docs)

---

Universidad Nacional de Colombia — Ingeniería de Software

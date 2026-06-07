# Banneton — Backend

Repositorio de código fuente (backend + API REST) del proyecto **Banneton**.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript 5
- **ORM:** Prisma 7 + PostgreSQL
- **Base de datos:** PostgreSQL 16 (Docker local / Supabase)
- **Contenedores:** Docker + Docker Compose

## Estructura

```
app/               # Next.js App Router
├── api/roles/     # API REST de ejemplo (entidad Rol)
lib/               # Utilidades (Prisma singleton)
prisma/            # Esquema de base de datos
public/            # Assets estáticos
```

## Primer uso

```bash
bash setup.sh        # Linux / macOS
# o
setup.bat            # Windows
```

Ver `setup.sh` para los pasos detallados (instalación, Docker, migraciones, build).

## Documentación del proyecto

- Documentos, diagramas y entregas: [`Berry-Team-UNAL/project-docs`](https://github.com/Berry-Team-UNAL/project-docs)

---

Universidad Nacional de Colombia — Ingeniería de Software

# =============================================================
# Dockerfile — Banneton
# Node 24 + pnpm 10.10.0 + Next.js + Prisma + PostgreSQL
# =============================================================

FROM node:24-alpine AS base

# Activar corepack y fijar pnpm 10.10.0
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

WORKDIR /app

# Copiar manifiestos primero (cache de capas Docker)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Generar cliente Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copiar código fuente y compilar
COPY . .
RUN pnpm build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["pnpm", "start"]

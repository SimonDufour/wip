ARG PROJECT="@metrica/web"
ARG PROJECT_PATH="apps/web"

FROM node:24-alpine AS alpine

RUN apk add --update --no-cache libc6-compat

FROM alpine AS base

RUN npm install -g corepack@latest && corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install -g turbo

FROM base AS pruner

ARG PROJECT

WORKDIR /app

COPY . .

RUN turbo prune "${PROJECT}" --docker

# BUILDER stage
# ------------------------------------------------------
FROM base AS builder

ARG PROJECT

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install \
    --no-frozen-lockfile \
    --filter "${PROJECT}..."

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    BUILDING_CONTAINER=true \
    pnpm turbo build --filter="${PROJECT}..."

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod --no-optional

FROM alpine AS runner

ARG PROJECT_PATH
ENV HOSTNAME=0.0.0.0
ENV KEEP_ALIVE_TIMEOUT=601000
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /app/apps/web/public ./apps/web/public

RUN mkdir -p apps/web/.next
RUN mkdir -p apps/web/.next/cache
RUN chown nextjs:nodejs apps/web/.next
RUN chown nextjs:nodejs apps/web/.next/cache

# Copy the standalone server and node_modules
COPY --from=builder --chown=nodejs:nextjs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nodejs:nextjs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nodejs:nextjs /app/apps/web/node_modules ./apps/web/node_modules
# Set permissions for local storage

RUN set -e; \
    mkdir -p /app/storage/files; \
    mkdir -p /app/apps/web/public/files; \
    chown -R 1001:1001 /app/storage/files /app/apps/web/public/files

USER nextjs

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["node", "server.js"]

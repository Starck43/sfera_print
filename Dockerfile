FROM node:alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY *.env .env.* package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# === ИСПРАВЛЕНИЕ: Диагностика сети и настройка для сборки ===
# 1. Добавляем curl для диагностики
RUN apk add --no-cache curl ca-certificates

# 2. Проверяем доступность API (опционально, для диагностики)
RUN echo "=== Проверка сети перед сборкой ===" && \
    echo "IP хоста Docker:" && \
    cat /etc/hosts && \
    echo "" && \
    echo "Проверка DNS:" && \
    nslookup sferaprint.istarck.ru 2>/dev/null || echo "nslookup не установлен" && \
    echo "" && \
    echo "Проверка доступа к API:" && \
    curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" \
    --max-time 5 https://sferaprint.istarck.ru/api/features/ || \
    echo "API недоступен"

# 3. Устанавливаем переменную для fallback режима
ENV NEXT_PUBLIC_BUILD_MODE=true
ENV SKIP_API_DURING_BUILD=true

# 4. Build the application
RUN \
    if [ -f package-lock.json ]; then SKIP_API_DURING_BUILD=true npm run build; \
    elif [ -f yarn.lock ]; then SKIP_API_DURING_BUILD=true yarn run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && SKIP_API_DURING_BUILD=true pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Production image, copy all the files and run next
FROM base
WORKDIR /app

ENV NODE_ENV=production

# сбрасываем флаг сборки для production
ENV NEXT_PUBLIC_BUILD_MODE=false
ENV SKIP_API_DURING_BUILD=false

RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

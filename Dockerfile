FROM node:20-alpine AS base

# Menginstall dependencies yang diperlukan
RUN apk add --no-cache libc6-compat

# Buat direktori aplikasi
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Layer untuk dependensi
FROM base AS deps
# Menginstall dependencies
RUN npm ci

# Layer untuk build
FROM base AS builder
WORKDIR /app
# Menyalin dependencies dari layer deps
COPY --from=deps /app/node_modules ./node_modules
# Menyalin semua file
COPY . .

# Set environment variable untuk build production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Build aplikasi
RUN npm run build

# Layer untuk production
FROM base AS runner
WORKDIR /app

# Install additional dependencies for script handling
RUN apk add --no-cache bash

# Set ke user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Menyalin file yang dibutuhkan dari builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Menyalin entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Menyalin .env.docker ke .env.example
COPY .env.docker ./.env.example

# Set environment variable
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose port
EXPOSE 3000

# Mendefinisikan health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Switching to nextjs user after file operations
USER nextjs

# Gunakan entrypoint script untuk setup environment variables
ENTRYPOINT ["./docker-entrypoint.sh"]

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]
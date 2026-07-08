# ── Stage 1: Install production deps ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Production image ──
FROM node:20-alpine
WORKDIR /app

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove dev files from final image
RUN rm -rf tests/ .env .env.example

ENV NODE_ENV=production
EXPOSE 5000

USER appuser
CMD ["node", "server.js"]

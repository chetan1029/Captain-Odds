## Base Image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

## Dev for Hot reloading
# FROM base AS dev

# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

## Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

#RUN npx prisma generate
#RUN npx prisma migrate deploy
#RUN npm run build

## Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma/  

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["npm", "run", "prod"]

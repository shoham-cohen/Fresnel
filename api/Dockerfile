FROM node:24-alpine AS deps
WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY api/ ./

EXPOSE 3000

CMD ["sh", "-c", "npm ci && npm run start:dev"]

FROM deps AS build
COPY api/ ./
RUN npm run build \
    && npm prune --omit=dev \
    && npm cache clean --force

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production API_PORT=3000

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node api/package.json ./package.json

USER node
EXPOSE 3000
CMD ["node", "dist/main"]
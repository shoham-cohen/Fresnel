# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm ci

# Development image: source is bind-mounted by docker-compose.yml.
FROM deps AS dev
ENV NODE_ENV=development
COPY api/ ./
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Compile NestJS with dev dependencies available.
FROM deps AS build
COPY api/ ./
RUN npm run build

# Install only runtime dependencies for the production image.
FROM node:24-alpine AS production-deps
WORKDIR /app
ENV NODE_ENV=production
COPY api/package.json api/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production API_PORT=3000
COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node api/package.json ./package.json
USER node
EXPOSE 3000
CMD ["node", "dist/main"]

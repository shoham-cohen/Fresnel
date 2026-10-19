# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY web-shob/package.json web-shob/package-lock.json ./
RUN npm ci

# Development image: Vite serves on 0.0.0.0:5173.
FROM deps AS dev
ENV NODE_ENV=development
COPY web-shob/ ./
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build static assets for production.
FROM deps AS build
COPY web-shob/ ./
RUN npm run build

# Nginx serves the Vite build and proxies /api/ to the NestJS service.
FROM nginx:1.28-alpine AS production
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


FROM node:24-alpine AS deps
WORKDIR /app

COPY web-shob/package.json web-shob/package-lock.json ./
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY web-shob/ ./

EXPOSE 5173

CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0"]

FROM deps AS build
COPY web-shob/ ./
RUN npm run build

FROM nginx:1.28-alpine AS production
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# web-vandamme: Vite build, served by nginx.
# Build:  docker build -t fresnel-web-vandamme web-vandamme
# Run:    docker run -p 8080:80 -e API_URL=http://api:3000 fresnel-web-vandamme
# nginx serves the static build and forwards /api to API_URL (same role as the Vite proxy in dev).

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# The nginx image runs envsubst on /etc/nginx/templates/*.template at startup
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV API_URL=http://api:3000
EXPOSE 80

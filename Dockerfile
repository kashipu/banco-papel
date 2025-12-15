# =========================
# 1. Build Angular (SSG)
# =========================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =========================
# 2. Runtime Nginx
# =========================
FROM nginx:alpine

# Puerto explícito (solo informativo, Nginx igual escucha en este)
EXPOSE 80

# Borramos config y html por defecto
RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

# Config Nginx explícita (puerto visible)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# AJUSTA esta ruta al dist real
# Ejemplos válidos:
# /app/dist/banco-papel
# /app/dist/banco-papel/browser
COPY --from=build /app/dist/banco-papel/browser /usr/share/nginx/html

# Arranque visible en logs
CMD ["nginx", "-g", "daemon off;"]

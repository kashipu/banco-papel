# =========================
# 1. Build Angular (SSR)
# =========================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =========================
# 2. Runtime Nginx (browser)
# =========================
FROM nginx:alpine

EXPOSE 80

# Limpiar defaults
RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

# Config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ CLAVE: copiar CONTENIDO de browser
COPY --from=build /app/dist/bancodepapel/browser/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
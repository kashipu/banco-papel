# =========================
# 1. Build Angular
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

# Puerto explícito
EXPOSE 80

# Limpiar default
RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

# Configuración Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👉 RUTA REAL DEL DIST (confirmada por logs)
COPY --from=build /app/dist/bancodepapel /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
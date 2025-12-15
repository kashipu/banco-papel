# ---------- Build stage ----------
    FROM node:22.12.0-alpine AS build

    WORKDIR /app
    
    # Instalar bun
    RUN npm install -g bun
    
    # Copiar dependencias
    COPY package.json bun.lock* ./
    RUN bun install
    
    # Copiar código
    COPY . .
    
    # Build Angular (SSG / estático)
    RUN bun run build
    
    
    # ---------- Runtime stage ----------
    FROM nginx:alpine
    
    # Limpiar config por defecto
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Config Nginx para SPA/SSG
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copiar build Angular
    # Ajusta si tu dist tiene otro nombre
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    
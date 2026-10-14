# =========================================================================
# Multi-stage Dockerfile for AquaBophelo React 19 / Vite SPA
# =========================================================================

FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests and install cleanly
COPY package*.json ./
RUN npm ci

# Copy source and compile production bundle
COPY . .
ARG VITE_API_BASE_URL=https://api.aquabophelo.app
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Nginx production runtime
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configure SPA fallback routing for React Router
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

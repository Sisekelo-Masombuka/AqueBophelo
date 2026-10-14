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

# Configure SPA fallback routing and static asset caching
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        add_header Cache-Control "public, max-age=31536000, immutable"; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Script to inject runtime environment variables into config.js before starting nginx
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'if [ -n "$VITE_API_BASE_URL" ]; then' >> /docker-entrypoint.sh && \
    echo '  echo "window.__CONFIG__ = { VITE_API_BASE_URL: \"$VITE_API_BASE_URL\" };" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]

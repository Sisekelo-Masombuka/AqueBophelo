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

# Configure SPA fallback routing, gzip compression, security headers and static asset caching
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    \
    # Enable Gzip Compression \
    gzip on; \
    gzip_vary on; \
    gzip_proxied any; \
    gzip_comp_level 6; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml; \
    \
    # Security Headers \
    add_header X-Frame-Options "DENY" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    \
    # HTML and dynamic files: never cache index.html \
    location / { \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache, no-store, must-revalidate" always; \
    } \
    \
    # Static Assets: 1-year immutable caching \
    location ~* \.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, max-age=31536000, immutable" always; \
    } \
    \
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

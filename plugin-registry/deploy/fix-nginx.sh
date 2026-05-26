#!/bin/bash

# Quick fix for Nginx SPA routing
# Run this to fix the 403 errors on /admin and other routes

set -e

DOMAIN="zalcli.com"
APP_DIR="/var/www/zalcli-registry"

echo "🔧 Fixing Nginx configuration for SPA routing..."

# Backup current config
cp /etc/nginx/sites-available/zalcli /etc/nginx/sites-available/zalcli.backup-$(date +%Y%m%d-%H%M%S)

# Update the location / block to handle SPA routing
cat > /etc/nginx/sites-available/zalcli << 'EOF'
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=3r/m;

server {
    listen 80;
    listen [::]:80;
    server_name zalcli.com www.zalcli.com;

    # Redirect HTTP to HTTPS (will be configured by certbot)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name zalcli.com www.zalcli.com;

    # SSL certificates (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/zalcli.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zalcli.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client files
    root /var/www/zalcli-registry/client/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~* \.(env|git|gitignore|md|sh|sql|db)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Auth endpoints - stricter rate limit
    location /api/auth/ {
        limit_req zone=auth_limit burst=3 nodelay;
        limit_req_status 429;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Custom error pages
    error_page 404 /error-pages/404.html;
    error_page 403 /error-pages/403.html;
    error_page 500 /error-pages/500.html;
    error_page 502 /error-pages/502.html;
    error_page 503 /error-pages/503.html;

    location ^~ /error-pages/ {
        root /var/www/zalcli-registry;
        internal;
    }

    # SPA fallback - MUST be last
    # This handles all client-side routes like /admin, /registry, etc.
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to source maps in production
    location ~* \.map$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

echo "✅ Nginx config updated"

# Test configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid"
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
    echo ""
    echo "✅ Fix complete! Try accessing https://zalcli.com/admin now"
else
    echo "❌ Configuration test failed!"
    echo "Restoring backup..."
    cp /etc/nginx/sites-available/zalcli.backup-* /etc/nginx/sites-available/zalcli
    exit 1
fi

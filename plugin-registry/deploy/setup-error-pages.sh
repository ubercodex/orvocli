#!/bin/bash

# Setup Custom Error Pages for ZAL CLI Registry
# Run this script after deploying to configure Nginx error pages

set -e

echo "🎨 Setting up custom error pages..."

# Create error pages directory
ERROR_DIR="/var/www/zalcli-registry/error-pages"
mkdir -p "$ERROR_DIR"

# Copy error pages
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/error-pages/"*.html "$ERROR_DIR/"

# Set permissions
chmod 644 "$ERROR_DIR"/*.html

echo "✓ Error pages copied to $ERROR_DIR"

# Update Nginx configuration
NGINX_CONF="/etc/nginx/sites-available/zalcli"

if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ Nginx config not found at $NGINX_CONF"
    echo "Please run deploy.sh first"
    exit 1
fi

# Backup original config
cp "$NGINX_CONF" "$NGINX_CONF.backup-$(date +%Y%m%d-%H%M%S)"

# Add error page directives to the server block
# This adds them before the location blocks

if grep -q "error_page 404" "$NGINX_CONF"; then
    echo "⚠️  Error pages already configured in Nginx"
else
    echo "📝 Adding error page directives to Nginx config..."
    
    # Find the line with "server_name" and add error pages after it
    sed -i '/server_name/a\
\
    # Custom error pages\
    error_page 404 /error-pages/404.html;\
    error_page 403 /error-pages/403.html;\
    error_page 500 /error-pages/500.html;\
    error_page 502 /error-pages/502.html;\
    error_page 503 /error-pages/503.html;\
\
    # Serve error pages\
    location ^~ /error-pages/ {\
        root /var/www/zalcli-registry;\
        internal;\
    }' "$NGINX_CONF"
    
    echo "✓ Error page directives added"
fi

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Nginx configuration is valid"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    
    echo ""
    echo "✅ Custom error pages setup complete!"
    echo ""
    echo "Error pages configured:"
    echo "  - 404: Page Not Found"
    echo "  - 403: Access Forbidden"
    echo "  - 500: Internal Server Error"
    echo "  - 502: Bad Gateway"
    echo "  - 503: Service Unavailable"
    echo ""
    echo "Test them by visiting:"
    echo "  - https://zalcli.com/nonexistent (404)"
    echo "  - https://zalcli.com/server/.env (403)"
else
    echo "❌ Nginx configuration test failed"
    echo "Restoring backup..."
    mv "$NGINX_CONF.backup-"* "$NGINX_CONF"
    exit 1
fi

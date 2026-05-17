#!/bin/bash
set -e

DOMAIN=$1
EMAIL=$2
INCLUDE_WWW=${3:-auto}

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: ./setup-ssl.sh <domain> <email> [www|nowww|auto]"
  echo ""
  echo "Examples:"
  echo "  ./setup-ssl.sh ubercli.com admin@ubercli.com           # Auto-detect www"
  echo "  ./setup-ssl.sh ubercli.com admin@ubercli.com www       # Force include www"
  echo "  ./setup-ssl.sh ubercli.com admin@ubercli.com nowww    # Skip www"
  exit 1
fi

echo "🔒 Setting up SSL certificate for $DOMAIN"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
  echo "📦 Installing Certbot..."
  apt-get update
  apt-get install -y certbot python3-certbot-nginx
fi

# Determine if we should include www
if [ "$INCLUDE_WWW" = "www" ]; then
  echo "📋 Including www.$DOMAIN (forced)"
  DOMAINS="-d $DOMAIN -d www.$DOMAIN"
elif [ "$INCLUDE_WWW" = "nowww" ]; then
  echo "📋 Skipping www.$DOMAIN (forced)"
  DOMAINS="-d $DOMAIN"
else
  # Auto-detect: try to resolve www subdomain
  echo "🔍 Checking if www.$DOMAIN exists..."
  if host www.$DOMAIN > /dev/null 2>&1; then
    echo "✅ www.$DOMAIN resolves, including it"
    DOMAINS="-d $DOMAIN -d www.$DOMAIN"
  else
    echo "⚠️  www.$DOMAIN does not resolve, skipping it"
    DOMAINS="-d $DOMAIN"
  fi
fi

# Get certificate
echo "📜 Requesting SSL certificate..."
echo "Trying: certbot --nginx $DOMAINS"

# Try with both domains first
if certbot --nginx $DOMAINS --non-interactive --agree-tos -m $EMAIL --redirect 2>&1 | tee /tmp/certbot.log; then
  SUCCESS=true
else
  # If it failed and we were trying both domains, try just the main domain
  if echo "$DOMAINS" | grep -q "www"; then
    echo ""
    echo "⚠️  Failed with www subdomain, trying without it..."
    DOMAINS="-d $DOMAIN"
    if certbot --nginx $DOMAINS --non-interactive --agree-tos -m $EMAIL --redirect; then
      SUCCESS=true
    else
      SUCCESS=false
    fi
  else
    SUCCESS=false
  fi
fi

if [ "$SUCCESS" = true ]; then
  echo ""
  echo "✅ SSL certificate installed successfully!"
  echo ""
  echo "Certificate details:"
  certbot certificates
  echo ""
  echo "🔄 Auto-renewal is enabled via systemd timer"
  systemctl enable certbot.timer 2>/dev/null || true
  systemctl start certbot.timer 2>/dev/null || true
  echo ""
  echo "🌐 Your site is now accessible at: https://$DOMAIN"
else
  echo ""
  echo "❌ SSL certificate installation failed"
  echo ""
  echo "Common issues:"
  echo "1. DNS not pointing to this server"
  echo "   - Check: dig $DOMAIN"
  echo "   - Should return this server's IP"
  echo ""
  echo "2. Firewall blocking port 80/443"
  echo "   - Check: sudo ufw status"
  echo "   - Should allow http and https"
  echo ""
  echo "3. Nginx not running"
  echo "   - Check: sudo systemctl status nginx"
  echo ""
  echo "4. Rate limit (5 failed attempts per hour)"
  echo "   - Wait 1 hour and try again"
  echo ""
  exit 1
fi

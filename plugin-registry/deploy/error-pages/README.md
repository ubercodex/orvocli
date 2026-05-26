# Custom Error Pages for ZAL CLI Registry

Beautiful, branded error pages for Nginx.

## Pages Included

- **404.html** - Page Not Found
- **403.html** - Access Forbidden  
- **500.html** - Internal Server Error
- **502.html** - Bad Gateway
- **503.html** - Service Unavailable

## Features

- 🎨 Matches ZAL CLI branding (cyan/violet gradient)
- ⭐ Animated starfield background
- 📱 Fully responsive
- 🔗 Quick navigation buttons
- 🎯 Clear error messages

## Installation

### Automatic Setup

From the deploy directory:

```bash
cd /opt/zalcli/plugin-registry/deploy
chmod +x setup-error-pages.sh
sudo ./setup-error-pages.sh
```

### Manual Setup

1. **Copy error pages:**
```bash
mkdir -p /var/www/zalcli-registry/error-pages
cp error-pages/*.html /var/www/zalcli-registry/error-pages/
chmod 644 /var/www/zalcli-registry/error-pages/*.html
```

2. **Edit Nginx config** (`/etc/nginx/sites-available/zalcli`):

Add these lines inside the `server` block:

```nginx
# Custom error pages
error_page 404 /error-pages/404.html;
error_page 403 /error-pages/403.html;
error_page 500 /error-pages/500.html;
error_page 502 /error-pages/502.html;
error_page 503 /error-pages/503.html;

# Serve error pages
location ^~ /error-pages/ {
    root /var/www/zalcli-registry;
    internal;
}
```

3. **Test and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Testing

- **404**: Visit any non-existent page (e.g., `https://zalcli.com/nonexistent`)
- **403**: Try accessing a protected path (e.g., `https://zalcli.com/server/.env`)
- **502**: Stop the backend service temporarily
- **503**: Set maintenance mode in Nginx

## Customization

Each HTML file is standalone with inline CSS. To customize:

1. Edit the HTML files in `deploy/error-pages/`
2. Update colors, text, or layout as needed
3. Re-run `setup-error-pages.sh` or manually copy to server

### Color Scheme

- **Primary gradient**: `#06b6d4` (cyan) → `#8b5cf6` (violet)
- **Background**: `#03030d` (dark blue)
- **Text**: `#e2e8f0` (light gray)

## Notes

- The `internal` directive in Nginx ensures error pages can't be accessed directly
- Error pages are served from `/var/www/zalcli-registry/error-pages/`
- All pages include animated stars for visual consistency with the main site

# Deployment Guide

## Prerequisites

1. **Ubuntu VPS** with root access
2. **Domain** pointing to your VPS IP (orvocli.com)
3. **GitHub OAuth App** created at https://github.com/settings/developers

## Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Orvo Plugin Registry
   - **Homepage URL**: https://orvocli.com
   - **Authorization callback URL**: https://orvocli.com/auth/callback
4. Save the **Client ID** and **Client Secret**

## Step 2: Deploy to VPS

SSH into your Ubuntu server and run:

```bash
# Clone the repo
git clone https://github.com/ubercodex/orvocli.git

# Navigate to deploy directory
cd orvocli/plugin-registry/deploy

# Make script executable and run
chmod +x deploy.sh
sudo ./deploy.sh orvocli.com your-email@example.com
```

**Important:** You must run the script from the `plugin-registry/deploy/` directory.

The script will:
- Install Node.js, Nginx, Certbot
- Setup SSL with Let's Encrypt
- Build and deploy server + client
- Create systemd service
- Configure Nginx reverse proxy

## Step 3: Configure OAuth

After deployment, edit the environment files:

```bash
# Server .env
sudo nano /var/www/orvocli-registry/server/.env
```

Update:
```
GITHUB_CLIENT_ID=your_actual_client_id
GITHUB_CLIENT_SECRET=your_actual_client_secret
```

```bash
# Client .env
sudo nano /var/www/orvocli-registry/client/.env
```

Update:
```
VITE_GITHUB_CLIENT_ID=your_actual_client_id
```

## Step 4: Rebuild & Restart

```bash
# Rebuild client with new env
cd /var/www/orvocli-registry/client
npm run build

# Restart server
sudo systemctl restart orvocli-registry
```

## Step 5: Verify

Visit https://orvocli.com — you should see the landing page!

## Useful Commands

```bash
# Check server logs
sudo journalctl -u orvocli-registry -f

# Restart server
sudo systemctl restart orvocli-registry

# Check server status
sudo systemctl status orvocli-registry

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Renew SSL (auto-renewed, but manual if needed)
sudo certbot renew
```

## Troubleshooting

### Server won't start
```bash
# Check logs
sudo journalctl -u orvocli-registry -n 50

# Verify .env exists
ls -la /var/www/orvocli-registry/server/.env

# Test server manually
cd /var/www/orvocli-registry/server
node dist/index.js
```

### SSL issues
```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Re-run certbot
sudo certbot --nginx -d orvocli.com -d www.orvocli.com
```

### Database issues
```bash
# Check database file
ls -la /var/www/orvocli-registry/server/data/

# Reset database (WARNING: deletes all data)
rm /var/www/orvocli-registry/server/data/registry.db
sudo systemctl restart orvocli-registry
```

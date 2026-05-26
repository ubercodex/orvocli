# Maintenance Guide

## Update Application

After pushing changes to GitHub:

```bash
# On your VPS
sudo /var/www/zalcli-registry/update.sh
```

The update script will:
- ✅ Pull latest changes from GitHub
- ✅ Preserve your `.env` configuration files
- ✅ Preserve your database
- ✅ Rebuild server and client
- ✅ Restart the service
- ✅ Verify everything is running

## Manual Update Steps

If you prefer manual control:

```bash
# 1. Pull changes
cd /opt/zalcli
git pull origin main

# 2. Update server
cd /var/www/zalcli-registry/server
# Backup .env first!
cp .env /tmp/server.env.backup
# Copy new files (excluding .git)
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.env' /opt/zalcli/plugin-registry/server/ ./
# Restore .env
cp /tmp/server.env.backup .env
# Rebuild
npm install
npm run build

# 3. Update client
cd /var/www/zalcli-registry/client
# Backup .env first!
cp .env /tmp/client.env.backup
# Copy new files
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.env' /opt/zalcli/plugin-registry/client/ ./
# Restore .env
cp /tmp/client.env.backup .env
# Rebuild
npm install
npm run build

# 4. Restart service
sudo systemctl restart zalcli-registry
```

## SSL Certificate Management

### Setup/Renew SSL

```bash
sudo /var/www/zalcli-registry/setup-ssl.sh zalcli.com your-email@example.com
```

### Check Certificate Status

```bash
sudo certbot certificates
```

### Force Renewal

```bash
sudo certbot renew --force-renewal
```

## Service Management

### Check Status

```bash
sudo systemctl status zalcli-registry
```

### View Logs

```bash
# Live logs
sudo journalctl -u zalcli-registry -f

# Last 50 lines
sudo journalctl -u zalcli-registry -n 50

# Errors only
sudo journalctl -u zalcli-registry -p err
```

### Restart Service

```bash
sudo systemctl restart zalcli-registry
```

### Stop/Start Service

```bash
sudo systemctl stop zalcli-registry
sudo systemctl start zalcli-registry
```

## Database Management

### Backup Database

```bash
# Create backup
sudo cp /var/www/zalcli-registry/server/data/registry.db \
       ~/backups/registry-$(date +%Y%m%d-%H%M%S).db

# Or use sqlite3 dump
sudo sqlite3 /var/www/zalcli-registry/server/data/registry.db .dump \
       > ~/backups/registry-$(date +%Y%m%d-%H%M%S).sql
```

### Restore Database

```bash
# From .db file
sudo systemctl stop zalcli-registry
sudo cp ~/backups/registry-YYYYMMDD-HHMMSS.db \
       /var/www/zalcli-registry/server/data/registry.db
sudo systemctl start zalcli-registry

# From .sql dump
sudo systemctl stop zalcli-registry
sudo sqlite3 /var/www/zalcli-registry/server/data/registry.db < ~/backups/registry-YYYYMMDD-HHMMSS.sql
sudo systemctl start zalcli-registry
```

### View Database Stats

```bash
sudo sqlite3 /var/www/zalcli-registry/server/data/registry.db "
  SELECT 'Users: ' || COUNT(*) FROM users
  UNION ALL
  SELECT 'Plugins: ' || COUNT(*) FROM plugins;
"
```

## Nginx Management

### Test Configuration

```bash
sudo nginx -t
```

### Reload Configuration

```bash
sudo systemctl reload nginx
```

### View Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## Firewall Management

### Check Firewall Status

```bash
sudo ufw status verbose
```

### Allow New Port

```bash
sudo ufw allow <port>
sudo ufw reload
```

## Security Checks

### Check File Permissions

```bash
# .env files should be 600 (root only)
ls -la /var/www/zalcli-registry/server/.env
ls -la /var/www/zalcli-registry/client/.env

# Database directory should be 700
ls -lad /var/www/zalcli-registry/server/data

# Client dist should be 755 (world readable)
ls -lad /var/www/zalcli-registry/client/dist
```

### Verify No .git in Web Directory

```bash
# Should return nothing
find /var/www/zalcli-registry -name ".git" -type d
```

### Check for Exposed Secrets

```bash
# Should return nothing
find /var/www/zalcli-registry/client/dist -name "*.env*"
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
sudo journalctl -u zalcli-registry -n 50

# Check if port 3001 is in use
sudo lsof -i :3001

# Verify .env exists
ls -la /var/www/zalcli-registry/server/.env
```

### Database Locked

```bash
# Check for stale connections
sudo lsof /var/www/zalcli-registry/server/data/registry.db

# Restart service
sudo systemctl restart zalcli-registry
```

### SSL Certificate Expired

```bash
# Check expiry
sudo certbot certificates

# Renew
sudo certbot renew

# Or use the script
sudo /var/www/zalcli-registry/setup-ssl.sh zalcli.com your-email@example.com
```

### High Memory Usage

```bash
# Check memory
free -h

# Check process memory
ps aux | grep node

# Restart service
sudo systemctl restart zalcli-registry
```

## Monitoring

### Setup Automated Backups

Add to crontab:

```bash
sudo crontab -e
```

Add:

```cron
# Backup database daily at 2 AM
0 2 * * * cp /var/www/zalcli-registry/server/data/registry.db /root/backups/registry-$(date +\%Y\%m\%d).db

# Clean old backups (keep 30 days)
0 3 * * * find /root/backups -name "registry-*.db" -mtime +30 -delete
```

### Monitor Disk Space

```bash
df -h
```

### Monitor Service Uptime

```bash
systemctl status zalcli-registry | grep Active
```

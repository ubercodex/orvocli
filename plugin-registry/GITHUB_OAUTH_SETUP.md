# GitHub OAuth Setup Guide

This guide explains how to set up GitHub OAuth for the plugin registry to enable user authentication and plugin publishing.

## 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `Orvo Plugin Registry` (or your preferred name)
   - **Homepage URL**: `https://orvocli.com` (or your domain)
   - **Authorization callback URL**: `https://orvocli.com/auth/callback`
   - **Application description**: (optional) "Plugin registry for Orvo CLI"

4. Click **"Register application"**

## 2. Get Your Credentials

After creating the app, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Click "Generate a new client secret" and copy it

⚠️ **Important**: Store the client secret securely. You won't be able to see it again!

## 3. Configure Server Environment

Edit `plugin-registry/server/.env`:

```bash
# Database
DATABASE_URL=./data/registry.db

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# Server
PORT=3001
NODE_ENV=production
```

## 4. Configure Client Environment

Edit `plugin-registry/client/.env`:

```bash
VITE_API_URL=https://orvocli.com/api
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

Note: The client only needs the **Client ID** (not the secret).

## 5. For Local Development

### Server `.env`:
```bash
DATABASE_URL=./data/registry.db
JWT_SECRET=dev-secret-change-in-production
GITHUB_CLIENT_ID=your_dev_client_id
GITHUB_CLIENT_SECRET=your_dev_client_secret
PORT=3001
NODE_ENV=development
```

### Client `.env`:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_dev_client_id
```

### Callback URL for Development:
When creating a separate OAuth app for development, use:
- **Authorization callback URL**: `http://localhost:5173/auth/callback`

## 6. Testing the OAuth Flow

1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Click "Sign in" in the header
4. You'll be redirected to GitHub to authorize the app
5. After authorization, you'll be redirected back to `/auth/callback`
6. You should be signed in and see your GitHub username in the header

## 7. Features Enabled by OAuth

Once authenticated, users can:
- ✅ Publish new plugins
- ✅ Update their own plugins
- ✅ Delete their own plugins
- ✅ View their plugin dashboard

## Security Notes

- ✅ JWT tokens are used for API authentication
- ✅ Client secret is never exposed to the frontend
- ✅ Users can only modify their own plugins
- ✅ All plugin mutations require authentication
- ✅ Tokens are stored in localStorage (consider httpOnly cookies for production)

## Troubleshooting

### "Authentication failed" error
- Check that your Client ID and Secret are correct
- Verify the callback URL matches exactly (including http/https)
- Check server logs for detailed error messages

### Redirect loop
- Make sure the callback URL in GitHub settings matches your app
- Clear browser localStorage and try again

### "Unauthorized" when publishing
- Check that the JWT_SECRET is the same on server
- Verify the token is being sent in the Authorization header
- Check server logs for JWT verification errors

## Production Checklist

- [ ] Use a strong, random JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS for all URLs
- [ ] Store secrets in environment variables (not in code)
- [ ] Consider using httpOnly cookies instead of localStorage
- [ ] Set up CORS properly for your domain
- [ ] Monitor failed authentication attempts
- [ ] Implement rate limiting on auth endpoints

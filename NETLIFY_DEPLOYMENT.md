# Netlify Deployment Guide

This guide will help you deploy the Texas Restaurant Tax Scanner to Netlify.

## Prerequisites

1. A GitHub account with your code repository
2. A Netlify account (free tier is sufficient)
3. Your repository should be pushed to GitHub

## Deployment Steps

### 1. Connect to Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify to access your repositories
4. Select your `restaurant-tax-scanner` repository

### 2. Configure Build Settings

In the Netlify deployment configuration:

- **Build command**: `node build-netlify.js`
- **Publish directory**: `.` (current directory)
- **Functions directory**: `netlify/functions` (should auto-detect)

### 3. Environment Variables (Optional)

If you need to set any environment variables:
- Go to Site settings → Environment variables
- Add any required variables

### 4. Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your site
3. You'll get a random URL like `https://amazing-name-123456.netlify.app`

### 5. Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

## How It Works

### Architecture

- **Frontend**: Static HTML, CSS, and JavaScript served by Netlify
- **Backend**: Serverless functions (Netlify Functions) that handle API requests
- **Database**: SQLite database bundled with the functions

### API Endpoints

The following endpoints are available as serverless functions:

- `/api/tax-data/comprehensive-rate` - Get comprehensive tax rates
- `/api/tax-data/freshness` - Get data freshness information
- `/api/tax-data/update-official` - Update from official sources
- `/api/tax-data/history` - Get update history
- `/api/tax-data/search` - Legacy search endpoint

### Configuration

The app automatically detects the environment:
- **Local development**: Uses `http://localhost:3001` for API calls
- **Netlify production**: Uses relative URLs that route to serverless functions

## Local Development

To run locally:

```bash
# Start the API server
npm start

# In another terminal, serve the frontend
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Troubleshooting

### Build Failures

1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are listed in `package.json`
3. Verify the build script runs locally: `npm run build`

### Function Errors

1. Check function logs in Netlify dashboard
2. Verify database file is being copied correctly
3. Check that all require paths are correct

### CORS Issues

The `netlify.toml` file includes CORS headers. If you encounter CORS issues:
1. Check that the headers are properly configured
2. Verify the API calls are using relative URLs in production

## Monitoring

- **Function logs**: Available in Netlify dashboard under Functions
- **Site analytics**: Available in Netlify dashboard
- **Error tracking**: Check function logs for any runtime errors

## Updating

To update your deployment:
1. Push changes to your GitHub repository
2. Netlify will automatically rebuild and deploy
3. Or manually trigger a deploy from the Netlify dashboard

## Support

If you encounter issues:
1. Check the Netlify documentation
2. Review the function logs
3. Test locally first to isolate the issue 
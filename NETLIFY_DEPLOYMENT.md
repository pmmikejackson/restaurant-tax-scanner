# Netlify Deployment Guide

This guide will help you deploy the Texas Restaurant Tax Scanner to Netlify with all necessary configurations.

## Prerequisites

- A Netlify account
- A GitHub repository with your code
- A Google Maps API key (for geocoding)

## Step 1: Set Up Environment Variables (SECURE)

**Important:** Never expose API keys in your frontend code! Set them as environment variables in Netlify.

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following environment variable:
   - **Key:** `GOOGLE_MAPS_API_KEY`
   - **Value:** Your actual Google Maps API key (e.g., `AIzaSyA4jbZSWX3hNWxuE7_vG82Op_sBwwuTVgM`)

## Step 2: Connect GitHub Repository

1. In Netlify dashboard, click **"New site from Git"**
2. Choose **GitHub** as your Git provider
3. Select your repository
4. Configure build settings:
   - **Build command:** `node build-netlify.js`
   - **Publish directory:** `.` (root directory)

## Step 3: Deploy

1. Click **"Deploy site"**
2. Wait for the deployment to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## File Structure

The deployment copies necessary files:
- API functions → `netlify/functions/`
- Database → `netlify/functions/tax_database.db`
- Frontend files → Root directory
- Secure config (no API keys) → `config.js`

## Security Features

✅ **API keys are secure** - Stored as environment variables, not in code
✅ **Server-side geocoding** - Google Maps API called from Netlify functions only
✅ **CORS configured** - Proper headers for API access
✅ **No sensitive data exposed** - Frontend only contains safe configuration

## Testing Deployment

After deployment, test these features:
1. **Location Services** - Click "Use my location" button
2. **Refresh Button** - Click "Refresh Tax Data"
3. **Tax Scanning** - Search for taxes by county/city
4. **Export Functions** - Download JSON/CSV data

## Troubleshooting

### Location Services Not Working
- Check that `GOOGLE_MAPS_API_KEY` environment variable is set in Netlify
- Verify the API key has Geocoding API enabled in Google Cloud Console

### API Functions Not Working
- Check Netlify function logs in the site dashboard
- Ensure build completed successfully
- Verify all files were copied during build

### Frontend Errors
- Check browser console for JavaScript errors
- Verify CONFIG object is loaded properly
- Ensure all required files are deployed

## Environment Variables Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| `GOOGLE_MAPS_API_KEY` | Server-side geocoding | Yes |

## API Endpoints

The following endpoints are available via Netlify functions:

- `/.netlify/functions/geocode` - Convert coordinates to address
- `/.netlify/functions/tax-data-freshness` - Get data freshness info
- `/.netlify/functions/tax-data-update-official` - Update tax data
- `/.netlify/functions/tax-data-comprehensive-rate` - Get comprehensive tax rates
- `/.netlify/functions/tax-data-search` - Search tax data
- `/.netlify/functions/tax-data-history` - Get update history

All functions include fallback data when the database is not available, ensuring the application remains functional.

## Security Notes

🔒 **Never commit API keys to your repository**
🔒 **All sensitive operations happen server-side**
🔒 **Frontend configuration contains no secrets**
🔒 **Environment variables are encrypted by Netlify**

## How It Works

### Architecture

- **Frontend**: Static HTML, CSS, and JavaScript served by Netlify
- **Backend**: Serverless functions (Netlify Functions) that handle API requests
- **Database**: SQLite database bundled with the functions

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
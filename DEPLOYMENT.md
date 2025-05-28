# 🚀 Deployment Guide - Texas Restaurant Tax Scanner

## Overview
This guide covers multiple deployment options for the Texas Restaurant Tax Scanner, from simple static hosting to full-stack cloud deployment.

## 🌟 **Option 1: Vercel (Recommended)**

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables support
- ✅ Node.js and database support
- ✅ Git integration

### Deployment Steps:

1. **Install Vercel CLI** (already done):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add GOOGLE_MAPS_API_KEY
   # Enter your API key when prompted
   
   vercel env add JWT_SECRET
   # Enter a secure random string
   ```

5. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

### Database Considerations:
- SQLite works for development but consider upgrading to PostgreSQL for production
- Vercel supports PostgreSQL through Vercel Postgres or external providers

---

## 🔥 **Option 2: Railway**

### Why Railway?
- ✅ Built for full-stack apps
- ✅ Automatic database provisioning
- ✅ Simple deployment
- ✅ Free tier with generous limits

### Deployment Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Database**:
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set GOOGLE_MAPS_API_KEY=your_api_key_here
   railway variables set JWT_SECRET=your_jwt_secret_here
   ```

---

## ☁️ **Option 3: Heroku**

### Deployment Steps:

1. **Install Heroku CLI** and login:
   ```bash
   # Install from https://devcenter.heroku.com/articles/heroku-cli
   heroku login
   ```

2. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set GOOGLE_MAPS_API_KEY=your_api_key_here
   heroku config:set JWT_SECRET=your_jwt_secret_here
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## 🐳 **Option 4: Docker + Any Cloud Provider**

### Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy to:
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**

---

## 🔒 **Security Best Practices**

### Environment Variables Required:
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
JWT_SECRET=your_super_secure_random_string
DATABASE_URL=your_database_connection_string (if using external DB)
NODE_ENV=production
```

### Google Maps API Security:
1. **Restrict API Key** in Google Cloud Console:
   - Go to APIs & Services → Credentials
   - Edit your API key
   - Add HTTP referrers: `https://yourdomain.com/*`
   - Restrict to specific APIs: Maps JavaScript API, Geocoding API

2. **Set Usage Quotas** to prevent unexpected charges

### Database Security:
- Use environment variables for database credentials
- Enable SSL connections
- Regular backups
- Consider read replicas for high traffic

---

## 📊 **Database Migration for Production**

### Option A: Keep SQLite (Simple)
- Works for small to medium traffic
- File-based, easy to backup
- No additional setup required

### Option B: Upgrade to PostgreSQL (Recommended)
1. **Update database configuration**:
   ```javascript
   // In server.js, replace SQLite with PostgreSQL
   const { Pool } = require('pg');
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
   });
   ```

2. **Update SQL queries** (most are compatible)

3. **Migration script**:
   ```bash
   # Export from SQLite
   sqlite3 database/taxes.db .dump > backup.sql
   
   # Import to PostgreSQL (after adapting syntax)
   psql $DATABASE_URL < backup.sql
   ```

---

## 🚀 **Quick Start Commands**

### For Vercel (Fastest):
```bash
# 1. Deploy
vercel

# 2. Add environment variables
vercel env add GOOGLE_MAPS_API_KEY
vercel env add JWT_SECRET

# 3. Deploy to production
vercel --prod
```

### For Railway:
```bash
# 1. Deploy
railway login
railway init
railway up

# 2. Add database
railway add postgresql

# 3. Set environment variables
railway variables set GOOGLE_MAPS_API_KEY=your_key
railway variables set JWT_SECRET=your_secret
```

---

## 🔧 **Post-Deployment Checklist**

- [ ] Test all API endpoints
- [ ] Verify Google Maps integration
- [ ] Test admin panel login
- [ ] Check database connectivity
- [ ] Verify SSL certificate
- [ ] Test tax scanning functionality
- [ ] Monitor performance and errors
- [ ] Set up monitoring/alerts

---

## 📈 **Scaling Considerations**

### For High Traffic:
1. **Database**: Upgrade to PostgreSQL with read replicas
2. **Caching**: Add Redis for session storage and API caching
3. **CDN**: Use Cloudflare for static assets
4. **Monitoring**: Add application monitoring (Sentry, DataDog)
5. **Load Balancing**: Multiple server instances

### Performance Optimizations:
- Enable gzip compression
- Optimize database queries
- Add database indexes
- Implement API rate limiting
- Cache static assets

---

## 💰 **Cost Estimates**

### Free Tiers:
- **Vercel**: Free for personal projects
- **Railway**: $5/month after free tier
- **Heroku**: $7/month for basic dyno

### Production Ready:
- **Vercel Pro**: $20/month
- **Railway**: $10-20/month
- **DigitalOcean**: $12-25/month

Choose based on your traffic expectations and budget! 
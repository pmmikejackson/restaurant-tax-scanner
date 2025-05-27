# Texas Restaurant Tax Scanner - Database System

## Overview

This document describes the database system for the Texas Restaurant Tax Scanner, which provides a comprehensive, updatable database of tax information for all Texas counties and cities.

## Features

- **SQLite Database**: Lightweight, serverless database perfect for this application
- **RESTful API**: Clean API endpoints for accessing tax data
- **Admin Interface**: Web-based admin panel for managing tax data
- **Automatic Updates**: Button-push updates from external sources
- **Authentication**: Secure admin access with JWT tokens
- **Audit Trail**: Track all changes and updates
- **Export Functionality**: Export data in JSON/CSV formats

## Database Schema

### Tables

#### `counties`
- `id` - Primary key
- `name` - Full county name (e.g., "Harris County")
- `slug` - URL-friendly identifier (e.g., "harris")
- `region` - Texas region (e.g., "Southeast Texas")
- `created_at` - Timestamp

#### `cities`
- `id` - Primary key
- `name` - City name (e.g., "Houston")
- `slug` - URL-friendly identifier (e.g., "houston")
- `county_id` - Foreign key to counties table
- `created_at` - Timestamp

#### `taxes`
- `id` - Primary key
- `name` - Tax name (e.g., "Texas State Sales Tax")
- `rate` - Tax rate (decimal, e.g., 6.25 for 6.25%)
- `description` - Detailed description
- `applies_to` - What the tax applies to
- `type` - Tax type: 'state', 'county', 'city', 'special', 'local'
- `county_id` - Optional county restriction
- `city_id` - Optional city restriction
- `is_percentage` - Boolean: true for percentage, false for fixed amount
- `is_active` - Boolean: whether tax is currently active
- `effective_date` - When tax becomes effective (optional)
- `expiration_date` - When tax expires (optional)
- `last_updated` - Last modification timestamp
- `created_at` - Creation timestamp

#### `admin_users`
- `id` - Primary key
- `username` - Admin username
- `password_hash` - Bcrypt hashed password
- `email` - Admin email
- `is_active` - Boolean: account status
- `created_at` - Timestamp

#### `tax_update_logs`
- `id` - Primary key
- `source` - Update source (e.g., "Texas Comptroller API")
- `status` - 'success', 'error', 'partial'
- `records_updated` - Number of records updated
- `error_message` - Error details if applicable
- `created_at` - Timestamp

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This creates the database schema and populates it with:
- All 254 Texas counties
- Basic state tax information
- Default admin user (username: `admin`, password: `admin123`)

### 3. Populate Cities (Optional)

```bash
node scripts/populate-cities.js
```

This adds city data for major counties.

### 4. Configure Environment

Copy `env.example` to `.env` and update:

```bash
cp env.example .env
```

Key settings:
- `JWT_SECRET` - Change this for production!
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `PORT` - Server port (default: 3000)

### 5. Start the Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

## API Endpoints

### Public Endpoints

#### Get Counties
```
GET /api/counties
```
Returns all Texas counties with ID, name, slug, and region.

#### Get Cities by County
```
GET /api/counties/:countyId/cities
```
Returns all cities in the specified county.

#### Get Tax Rates
```
GET /api/taxes/:countyId/:cityId?
```
Returns applicable tax rates for the location.

### Admin Endpoints (Require Authentication)

#### Login
```
POST /api/admin/login
Body: { "username": "admin", "password": "admin123" }
```
Returns JWT token for authentication.

#### Get All Taxes
```
GET /api/admin/taxes
Headers: Authorization: Bearer <token>
```
Returns all tax records with county/city names.

#### Create Tax
```
POST /api/admin/taxes
Headers: Authorization: Bearer <token>
Body: {
  "name": "New Tax",
  "rate": 2.5,
  "type": "city",
  "description": "Description",
  "applies_to": "All sales",
  "county_id": 1,
  "city_id": 1,
  "is_percentage": true,
  "effective_date": "2024-01-01"
}
```

#### Update Tax
```
PUT /api/admin/taxes/:id
Headers: Authorization: Bearer <token>
Body: { /* tax data */ }
```

#### Delete Tax (Deactivate)
```
DELETE /api/admin/taxes/:id
Headers: Authorization: Bearer <token>
```

#### Bulk Update from Sources
```
POST /api/admin/update-taxes
Headers: Authorization: Bearer <token>
```

## Admin Interface

Access the admin panel at: `http://localhost:3000/admin`

### Features

1. **Dashboard**: View statistics and system status
2. **Tax Management**: Add, edit, delete tax records
3. **Bulk Updates**: Update from external sources with one click
4. **Export**: Download tax data in JSON format
5. **Audit Trail**: View update history and logs

### Default Login
- Username: `admin`
- Password: `admin123`

**⚠️ Change the default password immediately in production!**

## Database Management

### Backup Database

```bash
cp database/taxes.db database/taxes_backup_$(date +%Y%m%d).db
```

### Restore Database

```bash
cp database/taxes_backup_YYYYMMDD.db database/taxes.db
```

### View Database

Use any SQLite browser or command line:

```bash
sqlite3 database/taxes.db
.tables
.schema taxes
SELECT * FROM taxes LIMIT 5;
```

## Adding New Tax Data

### Via Admin Interface

1. Go to `http://localhost:3000/admin`
2. Login with admin credentials
3. Click "➕ Add New Tax"
4. Fill in the form and save

### Via API

```javascript
const response = await fetch('/api/admin/taxes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    name: 'Houston City Tax',
    rate: 2.0,
    type: 'city',
    description: 'City sales tax for Houston',
    applies_to: 'All taxable sales',
    county_id: 1, // Harris County
    city_id: 15,  // Houston
    is_percentage: true,
    is_active: true
  })
});
```

### Via Direct Database

```sql
INSERT INTO taxes (
  name, rate, description, applies_to, type,
  county_id, city_id, is_percentage, is_active
) VALUES (
  'Special District Tax', 0.5, 'Special district sales tax',
  'All sales', 'special', 1, NULL, 1, 1
);
```

## Updating Tax Data

### Manual Updates

Use the admin interface to manually add, edit, or deactivate tax records.

### Automatic Updates

The system includes a framework for automatic updates from external sources:

1. **Texas Comptroller API**: Planned integration
2. **Municipal APIs**: City-specific tax data
3. **Third-party Services**: Commercial tax data providers

To implement automatic updates, modify the `/api/admin/update-taxes` endpoint in `server.js`.

### Scheduled Updates

You can set up scheduled updates using cron jobs:

```bash
# Add to crontab for daily updates at 2 AM
0 2 * * * curl -X POST -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/admin/update-taxes
```

## Security Considerations

### Production Deployment

1. **Change Default Credentials**: Update admin username/password
2. **Secure JWT Secret**: Use a strong, random JWT secret
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: API includes rate limiting (100 requests/15 minutes)
5. **Input Validation**: All inputs are validated and sanitized
6. **SQL Injection Protection**: Using parameterized queries

### Database Security

1. **File Permissions**: Restrict database file access
2. **Backups**: Regular encrypted backups
3. **Access Control**: Limit admin access to authorized users only

## Troubleshooting

### Common Issues

#### Database Not Found
```bash
# Reinitialize database
npm run init-db
```

#### Admin Login Failed
```bash
# Reset admin password
node -e "
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/taxes.db');
bcrypt.hash('newpassword', 10, (err, hash) => {
  db.run('UPDATE admin_users SET password_hash = ? WHERE username = ?', [hash, 'admin']);
  console.log('Password updated');
  db.close();
});
"
```

#### API Errors
- Check server logs for detailed error messages
- Verify authentication tokens are valid
- Ensure database file permissions are correct

### Logs

Server logs include:
- API request/response details
- Database operation results
- Authentication attempts
- Update operation status

## Performance Optimization

### Database Optimization

1. **Indexes**: Key fields are indexed for fast queries
2. **Query Optimization**: Efficient SQL queries with proper JOINs
3. **Connection Pooling**: SQLite handles connections efficiently

### API Optimization

1. **Caching**: Consider adding Redis for frequently accessed data
2. **Compression**: Enable gzip compression for API responses
3. **CDN**: Use CDN for static assets in production

## Integration Examples

### Frontend Integration

```javascript
// Load counties
const counties = await fetch('/api/counties').then(r => r.json());

// Load cities for a county
const cities = await fetch(`/api/counties/${countyId}/cities`).then(r => r.json());

// Get tax rates
const taxes = await fetch(`/api/taxes/${countyId}/${cityId}`).then(r => r.json());
```

### External System Integration

```javascript
// Example: POS system integration
async function getTaxRateForLocation(address) {
  // Geocode address to get county/city
  const location = await geocodeAddress(address);
  
  // Get tax rates from database
  const taxes = await fetch(`/api/taxes/${location.countyId}/${location.cityId}`)
    .then(r => r.json());
  
  return taxes.totalRate;
}
```

## Support

For issues or questions:

1. Check this documentation
2. Review server logs
3. Check the GitHub repository for known issues
4. Contact the development team

## License

This database system is part of the Texas Restaurant Tax Scanner project and follows the same license terms. 
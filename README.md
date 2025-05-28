# Texas Restaurant Tax Scanner

A comprehensive web application for identifying applicable sales tax rates for restaurant POS configuration in Texas. Now featuring **official data import** from the Texas State Comptroller's office.

## 🆕 What's New - Official Data Integration

### The Problem We Solved
Previously, Rockwall County was showing only 6.25% (state tax) instead of the correct 8.25% total rate because we were missing local tax data.

### The Solution
We now import **official tax rate data** directly from the Texas State Comptroller's office, ensuring:
- ✅ **Complete tax breakdown** (state + county + city + special districts)
- ✅ **Real-time accuracy** from the official source
- ✅ **Comprehensive coverage** of all 254 Texas counties
- ✅ **Automatic updates** from quarterly data releases

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Import Official Tax Data
```bash
# Import current tax rates from Texas State Comptroller
npm run import-texas-rates

# Test specific county
npm run test-county Rockwall
```

### 3. Start the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 4. Access the Application
Open your browser to: `http://localhost:3001`

## 📊 Features

### Official Data Integration
- **Direct import** from Texas State Comptroller's EDI files
- **Quarterly updates** with official rate changes
- **Complete tax breakdown** by jurisdiction type
- **Historical data** tracking and version control

### Comprehensive Tax Calculation
- **Total tax rate** with detailed breakdown
- **State tax** (6.25% base rate)
- **County tax** (varies by county)
- **City tax** (where applicable)
- **Special districts** (transit, hospital, etc.)

### Modern Web Interface
- **Responsive design** for all devices
- **Real-time search** with autocomplete
- **Visual tax breakdown** with color-coded categories
- **Data freshness indicators** and update history

## 🏛️ Data Sources

### Primary Source: Texas State Comptroller
- **Official EDI files** updated quarterly
- **Complete jurisdiction coverage** (all 254 counties)
- **Authoritative tax rates** for POS compliance
- **Historical rate tracking** for audit purposes

### Data Update Process
1. **Automatic detection** of new quarterly releases
2. **Secure download** from comptroller.texas.gov
3. **Intelligent parsing** of multiple file formats
4. **Database integration** with version control
5. **Validation** against existing data

## 🔧 API Endpoints

### Get Comprehensive Tax Rate
```
GET /api/tax-data/comprehensive-rate?county=Rockwall&city=Rockwall
```

### Update from Official Source
```
POST /api/tax-data/update-official
```

### Check Data Freshness
```
GET /api/tax-data/freshness
```

### View Update History
```
GET /api/tax-data/history
```

## 📁 Project Structure

```
restaurant-tax-scanner/
├── api/
│   ├── server.js              # Express API server
│   ├── tax-data-manager.js    # Database operations
│   └── texas-tax-importer.js  # Official data importer
├── scripts/
│   └── import-texas-rates.js  # Import script
├── database-schema.sql        # Database structure
├── seed-texas-data.sql       # Initial county data
├── index.html                # Main application
├── styles.css                # Application styles
├── script.js                 # Frontend logic
└── config.js                 # Configuration
```

## 🎯 Example: Rockwall County

**Before (Missing Local Taxes):**
- State Tax: 6.25%
- **Total: 6.25%** ❌

**After (Complete Official Data):**
- State Tax: 6.25%
- County Tax: 2.00%
- **Total: 8.25%** ✅

## 🔄 Updating Tax Data

### Manual Update
```bash
npm run import-texas-rates
```

### Via Web Interface
1. Click "Refresh Tax Data" button
2. System downloads latest official rates
3. Database automatically updates
4. Results show import statistics

### Scheduled Updates
The system can be configured for automatic quarterly updates when new data is released.

## 🛠️ Development

### Database Schema
- **States, Counties, Cities** - Geographic hierarchy
- **Tax Authorities** - Jurisdictional entities
- **Tax Data** - Versioned rate information
- **Update Logs** - Complete audit trail

### Testing
```bash
# Test specific county lookup
npm run test-county Harris

# Test comprehensive rate calculation
curl "http://localhost:3001/api/tax-data/comprehensive-rate?county=Rockwall"
```

## 📋 Requirements

- **Node.js** 14.0.0 or higher
- **SQLite3** (included with sqlite3 package)
- **Internet connection** for official data downloads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with official data
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Official Data Sources

- [Texas State Comptroller - Sales Tax Rates](https://comptroller.texas.gov/taxes/file-pay/edi/sales-tax-rates.php)
- [Local Sales Tax Rate History](https://mycpa.cpa.state.tx.us/taxrates/RateHist.do)
- [Texas EDI Documentation](https://comptroller.texas.gov/taxes/file-pay/edi/)

---

**Built for Texas restaurants by Texas developers** 🤠

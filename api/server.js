const express = require('express');
const path = require('path');
const TaxDataManager = require('./tax-data-manager');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// CORS middleware to allow requests from frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Initialize tax data manager
const taxManager = new TaxDataManager();

// Connect to database
taxManager.connect().then(() => {
    console.log('Connected to tax database');
}).catch(err => {
    console.error('Failed to connect to tax database:', err);
});

// API Routes

// Get comprehensive tax rate for a location
app.get('/api/tax-data/comprehensive-rate', async (req, res) => {
    try {
        const { county, city } = req.query;
        
        if (!county) {
            return res.status(400).json({ error: 'County parameter is required' });
        }
        
        const result = await taxManager.getComprehensiveTaxRate(county, city);
        res.json(result);
    } catch (error) {
        console.error('Error getting comprehensive tax rate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update tax data from official Texas State Comptroller source
app.post('/api/tax-data/update-official', async (req, res) => {
    try {
        const result = await taxManager.updateFromOfficialSource();
        res.json(result);
    } catch (error) {
        console.error('Error updating from official source:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update from official source',
            error: error.message 
        });
    }
});

// Get data freshness information
app.get('/api/tax-data/freshness', async (req, res) => {
    try {
        const freshness = await taxManager.getDataFreshness();
        res.json(freshness);
    } catch (error) {
        console.error('Error getting data freshness:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get update history
app.get('/api/tax-data/history', async (req, res) => {
    try {
        const history = await taxManager.getUpdateHistory();
        res.json(history);
    } catch (error) {
        console.error('Error getting update history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Legacy search endpoint (for backward compatibility)
app.get('/api/tax-data/search', async (req, res) => {
    try {
        const { county, city } = req.query;
        
        if (!county) {
            return res.status(400).json({ error: 'County parameter is required' });
        }
        
        // For now, redirect to comprehensive rate
        const result = await taxManager.getComprehensiveTaxRate(county, city);
        
        // Transform to legacy format if needed
        const legacyResult = {
            county: county,
            city: city || null,
            total_rate: result.total_percentage,
            breakdown: result.breakdown,
            details: result.details
        };
        
        res.json(legacyResult);
    } catch (error) {
        console.error('Error in legacy search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Texas Restaurant Tax Scanner API running on port ${port}`);
    console.log(`📍 Access the application at: http://localhost:${port}`);
    console.log(`🔗 API endpoints available at: http://localhost:${port}/api/`);
});

module.exports = app;
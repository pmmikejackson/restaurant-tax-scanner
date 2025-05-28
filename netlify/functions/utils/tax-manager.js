const path = require('path');
const TaxDataManager = require('../api/tax-data-manager');

let taxManager = null;

async function getTaxManager() {
    if (!taxManager) {
        // Use the correct database path for Netlify functions
        const dbPath = path.join(__dirname, '..', 'tax_database.db');
        taxManager = new TaxDataManager(dbPath);
        await taxManager.connect();
    }
    return taxManager;
}

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
};

function createResponse(statusCode, body, additionalHeaders = {}) {
    return {
        statusCode,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            ...additionalHeaders
        },
        body: JSON.stringify(body)
    };
}

function createErrorResponse(statusCode, message, error = null) {
    const body = { error: message };
    if (error && process.env.NODE_ENV !== 'production') {
        body.details = error.message;
        body.stack = error.stack;
    }
    console.error('Function error:', message, error);
    return createResponse(statusCode, body);
}

module.exports = {
    getTaxManager,
    createResponse,
    createErrorResponse,
    corsHeaders
}; 
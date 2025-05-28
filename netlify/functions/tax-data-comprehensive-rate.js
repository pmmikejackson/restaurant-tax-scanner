const { getTaxManager, createResponse, createErrorResponse } = require('./utils/tax-manager');

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return createResponse(200, {});
    }

    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, 'Method not allowed');
    }

    try {
        const { county, city } = event.queryStringParameters || {};
        
        if (!county) {
            return createErrorResponse(400, 'County parameter is required');
        }
        
        const taxManager = await getTaxManager();
        const result = await taxManager.getComprehensiveTaxRate(county, city);
        
        return createResponse(200, result);
    } catch (error) {
        console.error('Error getting comprehensive tax rate:', error);
        return createErrorResponse(500, 'Internal server error', error);
    }
}; 
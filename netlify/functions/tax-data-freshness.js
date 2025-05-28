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
        const taxManager = await getTaxManager();
        const freshness = await taxManager.getDataFreshness();
        
        return createResponse(200, freshness);
    } catch (error) {
        console.error('Error getting data freshness:', error);
        return createErrorResponse(500, 'Internal server error', error);
    }
}; 
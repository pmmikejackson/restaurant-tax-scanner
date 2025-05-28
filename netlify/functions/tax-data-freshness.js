const { getTaxManager, createResponse, createErrorResponse } = require('./utils/tax-manager');

exports.handler = async (event, context) => {
    console.log('Freshness function called:', event.httpMethod, event.path);
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return createResponse(200, {});
    }

    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, 'Method not allowed');
    }

    try {
        console.log('Getting tax manager...');
        const taxManager = await getTaxManager();
        console.log('Tax manager obtained, getting freshness data...');
        const freshness = await taxManager.getDataFreshness();
        console.log('Freshness data retrieved:', freshness);
        
        return createResponse(200, freshness);
    } catch (error) {
        console.error('Error in freshness function:', error);
        return createErrorResponse(500, 'Internal server error', error);
    }
}; 
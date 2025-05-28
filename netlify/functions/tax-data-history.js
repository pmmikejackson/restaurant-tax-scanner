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
        const history = await taxManager.getUpdateHistory();
        
        return createResponse(200, history);
    } catch (error) {
        console.error('Error getting update history:', error);
        return createErrorResponse(500, 'Internal server error', error);
    }
}; 
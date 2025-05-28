const { getTaxManager, createResponse, createErrorResponse } = require('./utils/tax-manager');

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return createResponse(200, {});
    }

    if (event.httpMethod !== 'POST') {
        return createErrorResponse(405, 'Method not allowed');
    }

    try {
        const taxManager = await getTaxManager();
        const result = await taxManager.updateFromOfficialSource();
        
        return createResponse(200, result);
    } catch (error) {
        console.error('Error updating from official source:', error);
        return createErrorResponse(500, 'Failed to update from official source', error);
    }
}; 
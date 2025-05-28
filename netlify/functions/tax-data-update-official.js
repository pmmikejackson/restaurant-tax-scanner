const { getTaxManager, createResponse, createErrorResponse } = require('./utils/tax-manager');

exports.handler = async (event, context) => {
    console.log('Update official function called:', event.httpMethod, event.path);
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return createResponse(200, {});
    }

    if (event.httpMethod !== 'POST') {
        return createErrorResponse(405, 'Method not allowed');
    }

    try {
        console.log('Getting tax manager...');
        const taxManager = await getTaxManager();
        console.log('Tax manager obtained, updating from official source...');
        const result = await taxManager.updateFromOfficialSource();
        console.log('Update result:', result);
        
        return createResponse(200, result);
    } catch (error) {
        console.error('Error in update official function:', error);
        return createErrorResponse(500, 'Failed to update from official source', error);
    }
}; 
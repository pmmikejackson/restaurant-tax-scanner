const { createResponse, createErrorResponse } = require('./utils/tax-manager');

exports.handler = async (event, context) => {
    console.log('Geocode function called:', event.httpMethod);
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return createResponse(200, {});
    }

    if (event.httpMethod !== 'POST') {
        return createErrorResponse(405, 'Method not allowed');
    }

    try {
        const { lat, lng } = JSON.parse(event.body);
        
        if (!lat || !lng) {
            return createErrorResponse(400, 'Latitude and longitude are required');
        }

        // Use Google Maps Geocoding API
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyA4jbZSWX3hNWxuE7_vG82Op_sBwwuTVgM';
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        
        console.log('Making geocoding request to Google Maps API');
        
        // Use dynamic import for fetch in Node.js environment
        const fetch = globalThis.fetch || (await import('node-fetch')).default;
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            return createResponse(200, {
                results: data.results,
                status: 'OK'
            });
        } else {
            console.error('Geocoding failed:', data.status, data.error_message);
            return createErrorResponse(400, `Geocoding failed: ${data.status}`);
        }
        
    } catch (error) {
        console.error('Error in geocode function:', error);
        return createErrorResponse(500, 'Internal server error', error);
    }
}; 
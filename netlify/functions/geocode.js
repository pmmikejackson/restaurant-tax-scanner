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

        // Get Google Maps API key from environment variables (secure)
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
            console.error('❌ GOOGLE_MAPS_API_KEY environment variable not set');
            
            // Return a mock response with basic location info for fallback
            return createResponse(200, {
                results: [{
                    address_components: [
                        {
                            long_name: "Texas",
                            short_name: "TX",
                            types: ["administrative_area_level_1", "political"]
                        },
                        {
                            long_name: "Harris County",
                            short_name: "Harris County",
                            types: ["administrative_area_level_2", "political"]
                        },
                        {
                            long_name: "Houston",
                            short_name: "Houston",
                            types: ["locality", "political"]
                        },
                        {
                            long_name: "77001",
                            short_name: "77001",
                            types: ["postal_code"]
                        }
                    ],
                    formatted_address: "Houston, TX, USA"
                }],
                status: 'OK'
            });
        }
        
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
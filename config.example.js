// Configuration file for Texas Restaurant Tax Scanner
// 
// SETUP INSTRUCTIONS:
// 1. Copy this file to 'config.js'
// 2. Get a Google Maps API key from: https://console.cloud.google.com/
// 3. Enable the "Geocoding API" for your project
// 4. Replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' with your actual API key
// 5. Secure your API key with domain restrictions
//
// SECURITY NOTE: 
// - Never commit config.js to version control
// - Use domain restrictions on your API key
// - Monitor your API usage

const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE'
};

// Make config available globally
window.CONFIG = CONFIG; 
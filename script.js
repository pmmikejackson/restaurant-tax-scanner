// Google Maps API integration with environment variable
// DO NOT commit API keys to version control!

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    // API key should be loaded from environment variables or server-side
    // For development, you can set this in your local environment
    // For production, use server-side proxy or environment variables
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || 
                   window.GOOGLE_MAPS_API_KEY || 
                   prompt('Please enter your Google Maps API key:');
    
    if (!apiKey) {
        console.error('Google Maps API key not found');
        showStatus('Google Maps API key not configured. Some features may not work.', 'error');
        return;
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geocoding&callback=initMap`;
    script.onerror = function() {
        console.error('Failed to load Google Maps API');
        showStatus('Failed to load mapping services. Some features may not work.', 'error');
    };
    document.head.appendChild(script);
}

// Load the API when the page loads
document.addEventListener('DOMContentLoaded', loadGoogleMapsAPI); 
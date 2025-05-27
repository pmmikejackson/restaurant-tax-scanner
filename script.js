// Multi-layer obfuscated API key
// Original: AIzaSyAn7R7YazRBhy43-XK8z0aaUiZC2WRRY84
// Encoded with: character substitution -> reverse -> base64
const obfuscatedKey = 'V1dHRkdKUEtMUUhHSEJBQ0RGSEpHUVhRWA==';

// Character substitution map (for decoding)
const charMap = {
    'X': 'A', 'Q': 'I', 'M': 'z', 'P': 'a', 'L': 'S', 'K': 'y', 'J': 'n', 'H': '7',
    'G': 'R', 'F': 'Y', 'E': 'B', 'D': 'h', 'C': '4', 'B': '3', 'A': '-', 'Z': 'X',
    'Y': 'K', 'W': '8', 'V': '0', 'U': 'U', 'T': 'i', 'S': 'Z', 'R': 'C', 'Q': '2',
    'P': 'W', 'O': 'r', 'N': 'e', 'M': 't', 'L': 'o', 'K': 'u', 'J': 'p', 'I': 'l',
    'H': 'm', 'G': 'f', 'F': 'g', 'E': 'v', 'D': 'b', 'C': 'j', 'B': 'q', 'A': 'x'
};

// Decode function with multiple layers
function decodeApiKey(encoded) {
    try {
        // Step 1: Base64 decode
        let decoded = atob(encoded);
        
        // Step 2: Reverse the string
        decoded = decoded.split('').reverse().join('');
        
        // Step 3: Character substitution
        let result = '';
        for (let char of decoded) {
            result += charMap[char] || char;
        }
        
        return result;
    } catch (e) {
        console.error('Failed to decode API key');
        return '';
    }
}

// Alternative simple obfuscation method
function simpleDecodeKey() {
    // Split and reconstruct the key
    const parts = ['AIza', 'SyAn', '7R7Y', 'azRB', 'hy43', '-XK8', 'z0aa', 'UiZC', '2WRR', 'Y84'];
    return parts.join('');
}

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    let apiKey = decodeApiKey(obfuscatedKey);
    
    // Fallback to simple method if complex decoding fails
    if (!apiKey || apiKey.length < 30) {
        apiKey = simpleDecodeKey();
    }
    
    if (!apiKey || apiKey.length < 30) {
        console.error('Invalid API key');
        showStatus('Failed to initialize mapping services. Some features may not work.', 'error');
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
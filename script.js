// Configuration - Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Texas county to city mapping (simplified for major counties)
const countyToCities = {
    'harris': ['Houston', 'Pasadena', 'Pearland', 'Sugar Land', 'Baytown', 'Katy', 'Humble', 'Spring', 'Cypress', 'Tomball'],
    'dallas': ['Dallas', 'Plano', 'Garland', 'Irving', 'Grand Prairie', 'Mesquite', 'Richardson', 'Carrollton', 'Addison', 'DeSoto'],
    'tarrant': ['Fort Worth', 'Arlington', 'Plano', 'Grand Prairie', 'Carrollton', 'Euless', 'Bedford', 'Grapevine', 'Hurst', 'Keller'],
    'bexar': ['San Antonio', 'Alamo Heights', 'Converse', 'Helotes', 'Leon Valley', 'Live Oak', 'Schertz', 'Selma', 'Universal City'],
    'travis': ['Austin', 'Cedar Park', 'Pflugerville', 'Round Rock', 'Lakeway', 'Bee Cave', 'Manor', 'West Lake Hills'],
    'collin': ['Plano', 'Frisco', 'McKinney', 'Allen', 'Richardson', 'Wylie', 'Carrollton', 'Addison'],
    'fort-bend': ['Sugar Land', 'Missouri City', 'Pearland', 'Stafford', 'Richmond', 'Rosenberg'],
    'denton': ['Denton', 'Lewisville', 'Flower Mound', 'Carrollton', 'Frisco', 'The Colony'],
    'williamson': ['Round Rock', 'Cedar Park', 'Georgetown', 'Pflugerville', 'Leander', 'Taylor'],
    'montgomery': ['Conroe', 'The Woodlands', 'Spring', 'Tomball', 'Montgomery', 'Willis']
};

// County name mapping for geocoding
const countyNameMapping = {
    'harris': 'Harris County',
    'dallas': 'Dallas County',
    'tarrant': 'Tarrant County',
    'bexar': 'Bexar County',
    'travis': 'Travis County',
    'collin': 'Collin County',
    'fort-bend': 'Fort Bend County',
    'denton': 'Denton County',
    'williamson': 'Williamson County',
    'montgomery': 'Montgomery County'
};

// Static tax data
let currentTaxData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadGoogleMapsAPI();
}

function setupEventListeners() {
    const countyInput = document.getElementById('county');
    const cityInput = document.getElementById('city');
    
    // Handle county input changes
    countyInput.addEventListener('input', function() {
        const countySlug = this.value.toLowerCase();
        cityInput.value = '';
        
        if (countySlug && countyToCities[countySlug]) {
            populateCityDropdown(countyToCities[countySlug]);
        }
    });
}

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    const apiKey = window.CONFIG?.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.warn('Google Maps API key not configured. Location services will be disabled.');
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize Google Maps services
function initGoogleMaps() {
    window.geocoder = new google.maps.Geocoder();
    console.log('Google Maps API loaded successfully');
}

// Use My Location function
function useLocation() {
    if (!navigator.geolocation) {
        showStatus('❌ Geolocation is not supported by this browser.', 'error');
        return;
    }

    if (!window.geocoder) {
        showStatus('❌ Location services not available. Please enter location manually.', 'error');
        return;
    }

    showStatus('🌍 Getting your location...', 'success');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            showStatus('📍 Location found! Looking up address...', 'success');
            reverseGeocode(lat, lng);
        },
        function(error) {
            let errorMsg = 'Unable to get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
                default:
                    errorMsg += 'Unknown error occurred.';
                    break;
            }
            showStatus(errorMsg + ' Please select manually.', 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// Reverse geocoding function
function reverseGeocode(lat, lng) {
    const latlng = new google.maps.LatLng(lat, lng);
    
    window.geocoder.geocode({ location: latlng }, function(results, status) {
        if (status === 'OK' && results[0]) {
            parseGeocodingResults(results);
        } else {
            showStatus('❌ Could not determine location. Please enter manually.', 'error');
        }
    });
}

// Parse geocoding results and populate form
function parseGeocodingResults(results) {
    if (!results || results.length === 0) {
        showStatus('❌ No location data found. Please enter manually.', 'error');
        return;
    }

    let county = null;
    let city = null;
    let zip = null;

    // Extract location components
    for (const result of results) {
        for (const component of result.address_components) {
            const types = component.types;
            
            if (types.includes('administrative_area_level_2')) {
                // This is the county
                let countyName = component.long_name.toLowerCase();
                // Remove "County" from the end if present
                countyName = countyName.replace(/\s+county$/i, '');
                // Convert to slug format
                county = countyName.replace(/\s+/g, '-');
            }
            
            if (types.includes('locality') || types.includes('sublocality')) {
                city = component.long_name;
            }
            
            if (types.includes('postal_code')) {
                zip = component.long_name;
            }
        }
    }

    // Populate form fields
    if (county) {
        document.getElementById('county').value = county;
        // Trigger county change to populate cities
        document.getElementById('county').dispatchEvent(new Event('input'));
    }
    
    if (city) {
        setTimeout(() => {
            document.getElementById('city').value = city;
        }, 100);
    }
    
    if (zip) {
        document.getElementById('zip').value = zip;
    }

    // Show success message
    const countyDisplay = countyNameMapping[county] || county;
    const cityDisplay = city || '';
    showStatus(`📍 Location found: ${cityDisplay}${cityDisplay && countyDisplay ? ', ' : ''}${countyDisplay}`, 'success');
}

// Generate tax data based on county and city
function generateTaxData(county, city, zip) {
    const baseTaxes = [{
        name: 'Texas State Sales Tax',
        rate: 6.25,
        is_percentage: true,
        description: 'Statewide sales tax applied to all taxable sales',
        applies_to: 'All food and beverage sales',
        type: 'state'
    }];

    const countyTaxes = {
        'harris': [
            { name: 'Harris County Tax', rate: 1.00, is_percentage: true, description: 'County-level sales tax', applies_to: 'All taxable sales', type: 'county' },
            { name: 'Metro Transit Tax', rate: 1.00, is_percentage: true, description: 'Transportation authority tax', applies_to: 'All taxable sales', type: 'special' }
        ],
        'dallas': [
            { name: 'Dallas County Tax', rate: 0.50, is_percentage: true, description: 'County-level sales tax', applies_to: 'All taxable sales', type: 'county' },
            { name: 'DART Tax', rate: 1.00, is_percentage: true, description: 'Dallas Area Rapid Transit tax', applies_to: 'All taxable sales', type: 'special' }
        ],
        'travis': [
            { name: 'Travis County Tax', rate: 0.75, is_percentage: true, description: 'County-level sales tax', applies_to: 'All taxable sales', type: 'county' }
        ],
        'bexar': [
            { name: 'Bexar County Tax', rate: 0.75, is_percentage: true, description: 'County-level sales tax', applies_to: 'All taxable sales', type: 'county' },
            { name: 'San Antonio MTA', rate: 0.50, is_percentage: true, description: 'Metropolitan Transit Authority tax', applies_to: 'All taxable sales', type: 'special' }
        ],
        'tarrant': [
            { name: 'Tarrant County Tax', rate: 0.50, is_percentage: true, description: 'County-level sales tax', applies_to: 'All taxable sales', type: 'county' },
            { name: 'Fort Worth MTA', rate: 0.50, is_percentage: true, description: 'Metropolitan Transit Authority tax', applies_to: 'All taxable sales', type: 'special' }
        ]
    };

    const cityTaxes = {
        'austin': [{ name: 'Austin City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'houston': [{ name: 'Houston City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'dallas': [{ name: 'Dallas City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'san antonio': [{ name: 'San Antonio City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'fort worth': [{ name: 'Fort Worth City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }]
    };

    let allTaxes = [...baseTaxes];
    
    if (countyTaxes[county]) {
        allTaxes = allTaxes.concat(countyTaxes[county]);
    }
    
    const cityKey = city.toLowerCase();
    if (cityTaxes[cityKey]) {
        allTaxes = allTaxes.concat(cityTaxes[cityKey]);
    }

    const totalRate = allTaxes.filter(t => t.is_percentage).reduce((sum, tax) => sum + tax.rate, 0) / 100;

    return {
        taxes: allTaxes,
        totalRate: totalRate
    };
}

// Populate city dropdown
function populateCityDropdown(cities) {
    const datalist = document.getElementById('city-list');
    datalist.innerHTML = '';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        datalist.appendChild(option);
    });
}

// Main scan function
function scanTaxes() {
    const county = document.getElementById('county').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    if (!county) {
        showStatus('Please select a county', 'error');
        return;
    }

    showLoading(true);
    
    setTimeout(() => {
        const taxData = generateTaxData(county, city, zip);
        currentTaxData = {
            location: { county, city, zip },
            taxes: taxData.taxes,
            totalRate: taxData.totalRate,
            scanDate: new Date().toISOString()
        };
        displayTaxes(currentTaxData);
        showLoading(false);
        showStatus('Tax scan completed successfully!', 'success');
    }, 2000);
}

// Display taxes function
function displayTaxes(taxData) {
    const taxGrid = document.getElementById('taxGrid');
    taxGrid.innerHTML = '';

    taxData.taxes.forEach(tax => {
        const taxCard = document.createElement('div');
        taxCard.className = 'tax-card ' + tax.type;
        taxCard.innerHTML = `
            <div class="tax-name">${tax.name}</div>
            <div class="tax-rate">${tax.is_percentage ? tax.rate + '%' : '$' + tax.rate}</div>
            <div class="tax-description">${tax.description || 'No description available'}</div>
            <div class="tax-applies-to"><strong>Applies to:</strong> ${tax.applies_to || 'All taxable sales'}</div>
        `;
        taxGrid.appendChild(taxCard);
    });

    // Add total rate summary
    const summaryCard = document.createElement('div');
    summaryCard.className = 'tax-card';
    summaryCard.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
    summaryCard.style.color = 'white';
    summaryCard.innerHTML = `
        <div class="tax-name" style="color: white;">Total Combined Rate</div>
        <div class="tax-rate" style="color: white;">${(taxData.totalRate * 100).toFixed(2)}%</div>
        <div class="tax-description" style="color: white;">Combined percentage rate for standard sales tax</div>
        <div class="tax-applies-to" style="background: rgba(255,255,255,0.1); color: white;"><strong>Note:</strong> Fixed fees are additional</div>
    `;
    taxGrid.appendChild(summaryCard);

    document.getElementById('results').classList.add('show');
}

// Export functions
function exportJSON() {
    if (!currentTaxData) {
        showStatus('Please scan taxes first', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(currentTaxData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'texas-restaurant-taxes-' + Date.now() + '.json';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Tax data exported successfully!', 'success');
}

function exportCSV() {
    if (!currentTaxData) {
        showStatus('Please scan taxes first', 'error');
        return;
    }
    
    let csv = 'Tax Name,Rate,Description,Applies To,Type\n';
    currentTaxData.taxes.forEach(tax => {
        const rate = tax.is_percentage ? tax.rate + '%' : '$' + tax.rate;
        csv += '"' + tax.name + '","' + rate + '","' + tax.description + '","' + tax.applies_to + '","' + tax.type + '"\n';
    });
    
    const dataBlob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'texas-restaurant-taxes-' + Date.now() + '.csv';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Tax data exported successfully!', 'success');
}

// Utility functions
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    if (statusDiv) {
        statusDiv.innerHTML = '<div class="status-message status-' + type + '">' + message + '</div>';
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 5000);
    }
} 
// Configuration - Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Texas county to city mapping (simplified for major counties)
const countyToCities = {
    'harris': ['ATASCOCITA', 'BAYTOWN', 'BELLAIRE', 'BUNKER HILL VILLAGE', 'CLEAR LAKE', 'CYPRESS', 'DEER PARK', 'FRIENDSWOOD', 'HOUSTON', 'HUMBLE', 'KATY', 'KEMAH', 'KINGWOOD', 'LA PORTE', 'LEAGUE CITY', 'MISSOURI CITY', 'PASADENA', 'PEARLAND', 'SEABROOK', 'SOUTH HOUSTON', 'SPRING', 'STAFFORD', 'SUGAR LAND', 'TOMBALL', 'WEST UNIVERSITY PLACE'],
    'dallas': ['ADDISON', 'BALCH SPRINGS', 'CARROLLTON', 'COCKRELL HILL', 'COMBINE', 'COPPELL', 'DALLAS', 'DESOTO', 'DUNCANVILLE', 'FARMERS BRANCH', 'GARLAND', 'GLENN HEIGHTS', 'GRAND PRAIRIE', 'HIGHLAND PARK', 'HUTCHINS', 'IRVING', 'LANCASTER', 'MESQUITE', 'PLANO', 'RICHARDSON', 'ROWLETT', 'SACHSE', 'SEAGOVILLE', 'SUNNYVALE', 'UNIVERSITY PARK', 'WILMER'],
    'tarrant': ['ARLINGTON', 'AZLE', 'BEDFORD', 'BENBROOK', 'BLUE MOUND', 'BURLESON', 'CARROLLTON', 'COLLEYVILLE', 'CROWLEY', 'EULESS', 'EVERMAN', 'FOREST HILL', 'FORT WORTH', 'GRAND PRAIRIE', 'GRAPEVINE', 'HALTOM CITY', 'HURST', 'KELLER', 'KENNEDALE', 'LAKE WORTH', 'MANSFIELD', 'NORTH RICHLAND HILLS', 'RICHLAND HILLS', 'RIVER OAKS', 'SAGINAW', 'SANSOM PARK', 'SOUTHLAKE', 'WATAUGA', 'WESTOVER HILLS', 'WESTWORTH VILLAGE', 'WHITE SETTLEMENT'],
    'bexar': ['ALAMO HEIGHTS', 'BALCONES HEIGHTS', 'CASTLE HILLS', 'CHINA GROVE', 'CONVERSE', 'ELMENDORF', 'FAIR OAKS RANCH', 'GREY FOREST', 'HELOTES', 'HILL COUNTRY VILLAGE', 'HOLLYWOOD PARK', 'KIRBY', 'LEON VALLEY', 'LIVE OAK', 'MACDONA', 'OLMOS PARK', 'SAN ANTONIO', 'SCHERTZ', 'SELMA', 'SHAVANO PARK', 'SOMERSET', 'TERRELL HILLS', 'UNIVERSAL CITY', 'WINDCREST'],
    'travis': ['AUSTIN', 'BARTON CREEK', 'BEE CAVE', 'BRIARCLIFF', 'CEDAR PARK', 'CREEDMOOR', 'DEL VALLE', 'ELGIN', 'GARFIELD', 'HORNSBY BEND', 'JONESTOWN', 'LAGO VISTA', 'LAKEWAY', 'MANOR', 'MCNEIL', 'MUSTANG RIDGE', 'PFLUGERVILLE', 'POINT VENTURE', 'ROLLINGWOOD', 'SUNSET VALLEY', 'VOLENTE', 'WELLS BRANCH', 'WEST LAKE HILLS'],
    'collin': ['ADDISON', 'ALLEN', 'CARROLLTON', 'FRISCO', 'MCKINNEY', 'PLANO', 'RICHARDSON', 'WYLIE'],
    'fort-bend': ['MISSOURI CITY', 'PEARLAND', 'RICHMOND', 'ROSENBERG', 'STAFFORD', 'SUGAR LAND'],
    'denton': ['CARROLLTON', 'DENTON', 'FLOWER MOUND', 'FRISCO', 'LEWISVILLE', 'THE COLONY'],
    'williamson': ['CEDAR PARK', 'GEORGETOWN', 'LEANDER', 'PFLUGERVILLE', 'ROUND ROCK', 'TAYLOR'],
    'montgomery': ['CONROE', 'MONTGOMERY', 'SPRING', 'THE WOODLANDS', 'TOMBALL', 'WILLIS'],
    'rockwall': ['ROCKWALL']
};

// County name mapping for geocoding (updated to all caps)
const countyNameMapping = {
    'harris': 'HARRIS COUNTY',
    'dallas': 'DALLAS COUNTY',
    'tarrant': 'TARRANT COUNTY',
    'bexar': 'BEXAR COUNTY',
    'travis': 'TRAVIS COUNTY',
    'collin': 'COLLIN COUNTY',
    'fort-bend': 'FORT BEND COUNTY',
    'denton': 'DENTON COUNTY',
    'williamson': 'WILLIAMSON COUNTY',
    'montgomery': 'MONTGOMERY COUNTY',
    'rockwall': 'ROCKWALL COUNTY'
};

// Reverse mapping from display names to slugs (updated to all caps)
const countyDisplayToSlug = {
    'HARRIS COUNTY': 'harris',
    'DALLAS COUNTY': 'dallas',
    'TARRANT COUNTY': 'tarrant',
    'BEXAR COUNTY': 'bexar',
    'TRAVIS COUNTY': 'travis',
    'COLLIN COUNTY': 'collin',
    'FORT BEND COUNTY': 'fort-bend',
    'DENTON COUNTY': 'denton',
    'WILLIAMSON COUNTY': 'williamson',
    'MONTGOMERY COUNTY': 'montgomery',
    'ROCKWALL COUNTY': 'rockwall'
};

// Function to convert county display name to slug
function getCountySlug(displayName) {
    return countyDisplayToSlug[displayName] || displayName.toLowerCase().replace(/\s+/g, '-').replace(/\s+county$/i, '');
}

// Static tax data
let currentTaxData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadDataFreshness();
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
        const countyDisplay = this.value;
        const countySlug = getCountySlug(countyDisplay);
        cityInput.value = '';
        
        if (countySlug && countyToCities[countySlug]) {
            populateCityDropdown(countyToCities[countySlug]);
            cityInput.placeholder = "Type or select city...";
        } else {
            // Clear city options if no county selected
            const cityDatalist = document.getElementById('city-list');
            cityDatalist.innerHTML = '';
            cityInput.placeholder = "Select county first...";
        }
    });
}

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    const apiKey = window.CONFIG?.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.warn('Google Maps API key not configured. Location services will work with basic coordinates only.');
        return;
    }

    // Check if we're on HTTPS (required for geolocation)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('HTTPS required for geolocation. Location services may not work.');
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Add error handling for script loading
    script.onerror = function() {
        console.error('Failed to load Google Maps API - location services will work with basic coordinates only');
    };
    
    document.head.appendChild(script);
}

// Initialize Google Maps services
function initGoogleMaps() {
    try {
        window.geocoder = new google.maps.Geocoder();
        console.log('Google Maps API loaded successfully - enhanced location services available');
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        console.log('Location services will work with basic coordinates only');
    }
}

// Use My Location function
function useLocation() {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        showStatus('❌ Geolocation is not supported by this browser. Please enter location manually.', 'error');
        return;
    }

    // Check if we're on HTTPS (required for geolocation in most browsers)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        showStatus('❌ Location services require HTTPS. Please enter location manually.', 'error');
        return;
    }

    // If Google Maps geocoder is not available, use a simpler approach
    if (!window.geocoder) {
        showStatus('🌍 Getting your location... (Google Maps not available, using basic location)', 'success');
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                showStatus(`📍 Location found: ${lat.toFixed(4)}, ${lng.toFixed(4)}. Please enter your county and city manually.`, 'warning');
                
                // Focus on the county input to help user
                const countyInput = document.getElementById('county');
                if (countyInput) {
                    countyInput.focus();
                }
            },
            function(error) {
                let errorMsg = '❌ Unable to get your location. ';
                let suggestion = ' Please enter your location manually using the form below.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += 'Location access was denied.';
                        suggestion = ' To use location services, please allow location access in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += 'Location information is unavailable.';
                        suggestion = ' Please check your device\'s location settings and try again, or enter your location manually.';
                        break;
                    case error.TIMEOUT:
                        errorMsg += 'Location request timed out.';
                        suggestion = ' Please try again or enter your location manually.';
                        break;
                    default:
                        errorMsg += 'An unknown error occurred.';
                        break;
                }
                showStatus(errorMsg + suggestion, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 300000
            }
        );
        return;
    }

    showStatus('🌍 Getting your location... (Please allow location access when prompted)', 'success');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            showStatus('📍 Location found! Looking up address...', 'success');
            reverseGeocode(lat, lng);
        },
        function(error) {
            let errorMsg = '❌ Unable to get your location. ';
            let suggestion = ' Please enter your location manually using the form below.';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Location access was denied.';
                    suggestion = ' To use location services, please allow location access in your browser settings and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information is unavailable.';
                    suggestion = ' Please check your device\'s location settings and try again, or enter your location manually.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    suggestion = ' Please try again or enter your location manually.';
                    break;
                default:
                    errorMsg += 'An unknown error occurred.';
                    break;
            }
            showStatus(errorMsg + suggestion, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
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
        const countyDisplay = countyNameMapping[county] || county.toUpperCase() + ' COUNTY';
        document.getElementById('county').value = countyDisplay;
        // Trigger county change to populate cities
        document.getElementById('county').dispatchEvent(new Event('input'));
    }
    
    if (city) {
        setTimeout(() => {
            document.getElementById('city').value = city.toUpperCase();
        }, 100);
    }
    
    if (zip) {
        document.getElementById('zip').value = zip;
    }

    // Show success message
    const cityDisplay = city || '';
    showStatus(`📍 Location found: ${cityDisplay}${cityDisplay ? ', ' : ''}${countyNameMapping[county] || county.toUpperCase() + ' COUNTY'}`, 'success');
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
        'AUSTIN': [{ name: 'Austin City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'HOUSTON': [{ name: 'Houston City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'DALLAS': [{ name: 'Dallas City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'SAN ANTONIO': [{ name: 'San Antonio City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }],
        'FORT WORTH': [{ name: 'Fort Worth City Tax', rate: 2.00, is_percentage: true, description: 'City sales tax', applies_to: 'All taxable sales', type: 'local' }]
    };

    let allTaxes = [...baseTaxes];
    
    if (countyTaxes[county]) {
        allTaxes = allTaxes.concat(countyTaxes[county]);
    }
    
    const cityKey = city.toUpperCase();
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
    const cityInput = document.getElementById('city');
    const cityDatalist = document.getElementById('city-list');
    cityDatalist.innerHTML = '';
    
    // Sort cities alphabetically
    const sortedCities = [...cities].sort();
    
    sortedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityDatalist.appendChild(option);
    });
}

// Main scan function
async function scanTaxes() {
    const countyDisplay = document.getElementById('county').value;
    const county = getCountySlug(countyDisplay);
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    if (!county) {
        showStatus('Please select a county', 'error');
        return;
    }

    showLoading(true);
    
    try {
        // Try to use the API server first
        const apiUrl = `${CONFIG.API_BASE_URL}/api/tax-data/comprehensive-rate?county=${encodeURIComponent(county)}&city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}`;
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            const apiData = await response.json();
            
            if (apiData && apiData.total_rate) {
                // Transform API data to match our frontend format
                const taxes = [];
                
                // Add state taxes
                if (apiData.breakdown.state) {
                    apiData.breakdown.state.forEach(tax => {
                        taxes.push({
                            name: tax.name,
                            rate: tax.rate,
                            is_percentage: true,
                            description: `State-level sales tax (${tax.authority})`,
                            applies_to: 'All taxable sales',
                            type: 'state'
                        });
                    });
                }
                
                // Add county taxes
                if (apiData.breakdown.county) {
                    apiData.breakdown.county.forEach(tax => {
                        taxes.push({
                            name: tax.name,
                            rate: tax.rate,
                            is_percentage: true,
                            description: `County-level sales tax (${tax.authority})`,
                            applies_to: 'All taxable sales',
                            type: 'county'
                        });
                    });
                }
                
                // Add city taxes
                if (apiData.breakdown.city) {
                    apiData.breakdown.city.forEach(tax => {
                        taxes.push({
                            name: tax.name,
                            rate: tax.rate,
                            is_percentage: true,
                            description: `City-level sales tax (${tax.authority})`,
                            applies_to: 'All taxable sales',
                            type: 'local'
                        });
                    });
                }
                
                // Add special taxes
                if (apiData.breakdown.special) {
                    apiData.breakdown.special.forEach(tax => {
                        taxes.push({
                            name: tax.name,
                            rate: tax.rate,
                            is_percentage: true,
                            description: `Special district tax (${tax.authority})`,
                            applies_to: 'All taxable sales',
                            type: 'special'
                        });
                    });
                }
                
                currentTaxData = {
                    location: { county: countyDisplay, city, zip },
                    taxes: taxes,
                    totalRate: apiData.total_rate / 100, // Convert percentage to decimal
                    scanDate: new Date().toISOString(),
                    source: 'database'
                };
                displayTaxes(currentTaxData);
                showLoading(false);
                showStatus('✅ Tax scan completed using official database!', 'success');
                return;
            }
        }
        
        // Fallback to static data if API is not available
        console.warn('API not available, falling back to static data');
        const taxData = generateTaxData(county, city, zip);
        currentTaxData = {
            location: { county: countyDisplay, city, zip },
            taxes: taxData.taxes,
            totalRate: taxData.totalRate,
            scanDate: new Date().toISOString(),
            source: 'static'
        };
        displayTaxes(currentTaxData);
        showLoading(false);
        showStatus('⚠️ Using limited static data. Start API server for complete data.', 'warning');
        
    } catch (error) {
        console.error('Error fetching tax data:', error);
        
        // Fallback to static data
        const taxData = generateTaxData(county, city, zip);
        currentTaxData = {
            location: { county: countyDisplay, city, zip },
            taxes: taxData.taxes,
            totalRate: taxData.totalRate,
            scanDate: new Date().toISOString(),
            source: 'static'
        };
        displayTaxes(currentTaxData);
        showLoading(false);
        showStatus('⚠️ Using limited static data. Check API server connection.', 'warning');
    }
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

// Load data freshness information
async function loadDataFreshness() {
    console.log('📊 loadDataFreshness function called');
    
    try {
        // Call the actual API endpoint with strong cache busting
        const cacheBuster = Date.now() + Math.random();
        const apiUrl = `${CONFIG.API_BASE_URL}/api/tax-data/freshness?_=${cacheBuster}`;
        console.log('🌐 Loading data freshness from:', apiUrl);
        console.log('🔄 Cache buster value:', cacheBuster);
        
        const response = await fetch(apiUrl, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        console.log('📡 Freshness API response status:', response.status);
        console.log('📡 Freshness API response ok:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Data freshness API response:', data);
            updateDataFreshnessUI(data);
            console.log('✅ Data freshness UI updated successfully');
        } else {
            console.error('❌ Failed to load data freshness. Status:', response.status);
            showDataError();
        }
    } catch (error) {
        console.error('❌ Error loading data freshness:', error);
        console.error('❌ Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Fallback to mock data if API is not available
        console.log('🔄 Falling back to mock data...');
        const mockDataFreshness = {
            source_date: '2025-05-01',
            imported_date: '2025-05-28',
            version_number: '2025.Q2',
            update_frequency: 'quarterly',
            days_since_import: 0
        };
        
        updateDataFreshnessUI(mockDataFreshness);
        console.log('✅ Mock data freshness UI updated');
    }
}

// Update the data freshness UI
function updateDataFreshnessUI(data) {
    console.log('🎨 updateDataFreshnessUI called with data:', data);
    
    const sourceDate = document.getElementById('sourceDate');
    const lastUpdated = document.getElementById('lastUpdated');
    const lastChecked = document.getElementById('lastChecked');
    const dataVersion = document.getElementById('dataVersion');
    const updateFrequency = document.getElementById('updateFrequency');
    const freshnessIndicator = document.getElementById('freshnessIndicator');
    
    console.log('🔍 DOM elements found:', {
        sourceDate: !!sourceDate,
        lastUpdated: !!lastUpdated,
        lastChecked: !!lastChecked,
        dataVersion: !!dataVersion,
        updateFrequency: !!updateFrequency,
        freshnessIndicator: !!freshnessIndicator
    });
    
    // Handle source date
    if (sourceDate) {
        const formattedSourceDate = data.source_date ? formatDate(data.source_date) : 'Unknown';
        sourceDate.textContent = formattedSourceDate;
        console.log('📅 Source date updated:', formattedSourceDate);
    }
    
    // Handle last updated
    if (lastUpdated) {
        const formattedLastUpdated = data.imported_date ? formatDate(data.imported_date) : 'Unknown';
        lastUpdated.textContent = formattedLastUpdated;
        console.log('📅 Last updated field updated:', formattedLastUpdated);
    }
    
    // Handle last checked
    if (lastChecked) {
        if (data.last_checked) {
            const formattedTime = formatDateTime(data.last_checked);
            console.log('⏰ Updating Last Checked field:', data.last_checked, '->', formattedTime);
            lastChecked.textContent = formattedTime;
            console.log('✅ Last Checked field updated successfully to:', formattedTime);
        } else {
            console.log('⚠️ No last_checked data available, setting to Never');
            lastChecked.textContent = 'Never';
        }
    } else {
        console.error('❌ lastChecked element not found in DOM');
    }
    
    // Handle data version
    if (dataVersion) {
        const versionText = data.version_number || 'Unknown';
        dataVersion.textContent = versionText;
        console.log('🏷️ Data version updated:', versionText);
    }
    
    // Handle update frequency
    if (updateFrequency) {
        const frequencyText = capitalizeFirst(data.update_frequency || 'quarterly');
        updateFrequency.textContent = frequencyText;
        console.log('🔄 Update frequency updated:', frequencyText);
    }
    
    // Determine freshness status
    const daysSinceImport = data.days_since_import || 0;
    let status = 'fresh';
    let statusText = 'Up to date';
    
    // For quarterly data, anything older than 3 months (90 days) is stale
    // Anything older than 6 months (180 days) is severely outdated
    if (daysSinceImport > 180) { // 6 months
        status = 'outdated';
        statusText = 'Severely outdated';
    } else if (daysSinceImport > 90) { // 3 months
        status = 'stale';
        statusText = 'Needs quarterly update';
    }
    
    // Special check for version number - if it's from a previous year, it's definitely outdated
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    const versionMatch = (data.version_number || '').match(/(\d{4})\.Q(\d)/);
    
    if (versionMatch) {
        const versionYear = parseInt(versionMatch[1]);
        const versionQuarter = parseInt(versionMatch[2]);
        
        if (versionYear < currentYear || 
            (versionYear === currentYear && versionQuarter < currentQuarter - 1)) {
            status = 'outdated';
            statusText = 'Version outdated';
        }
    }
    
    if (freshnessIndicator) {
        freshnessIndicator.className = `freshness-indicator ${status}`;
        const statusTextElement = freshnessIndicator.querySelector('.status-text');
        if (statusTextElement) {
            statusTextElement.textContent = statusText;
            console.log('🚦 Freshness indicator updated:', status, statusText);
        }
    }
    
    console.log('✅ updateDataFreshnessUI completed successfully');
}

// Show data error state
function showDataError() {
    const freshnessIndicator = document.getElementById('freshnessIndicator');
    if (freshnessIndicator) {
        freshnessIndicator.className = 'freshness-indicator outdated';
        const statusTextElement = freshnessIndicator.querySelector('.status-text');
        if (statusTextElement) statusTextElement.textContent = 'Error loading';
    }
}

// Update the refreshTaxData function to use the official source
async function refreshTaxData() {
    console.log('🔄 refreshTaxData function called');
    
    const refreshBtn = document.getElementById('refreshTaxData');
    if (!refreshBtn) {
        console.error('❌ Refresh button not found in DOM');
        alert('Error: Refresh button not found. Please refresh the page and try again.');
        return;
    }
    
    console.log('✅ Refresh button found:', refreshBtn);
    
    const originalText = refreshBtn.innerHTML;
    console.log('📝 Original button text:', originalText);
    
    try {
        console.log('🔄 Starting refresh process...');
        refreshBtn.innerHTML = '🔄 Updating from Official Source...';
        refreshBtn.disabled = true;
        
        const apiUrl = `${CONFIG.API_BASE_URL}/api/tax-data/update-official`;
        console.log('🌐 Making API call to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 API response status:', response.status);
        console.log('📡 API response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📊 Refresh API response:', result);
        
        if (result.success) {
            if (result.details && result.details.message === 'Data already exists') {
                showStatus('✅ Tax data is up to date. No new updates available.', 'success');
                console.log('✅ Data already up to date');
            } else {
                showStatus('✅ Tax data updated successfully from Texas State Comptroller!', 'success');
                console.log('✅ Data updated successfully');
                
                // Show detailed results if available
                if (result.details) {
                    const details = result.details;
                    setTimeout(() => {
                        showStatus(
                            `📊 Import Results: ${details.imported || 0} imported, ${details.updated || 0} updated, ${details.errors || 0} errors`,
                            'success'
                        );
                    }, 2000);
                }
            }
            
            // Force multiple refresh attempts to ensure the UI updates
            console.log('🔄 Starting data freshness refresh...');
            
            // First refresh after 1 second
            setTimeout(async () => {
                console.log('🔄 First refresh attempt...');
                await loadDataFreshness();
            }, 1000);
            
            // Second refresh after 2.5 seconds to ensure database is fully updated
            setTimeout(async () => {
                console.log('🔄 Second refresh attempt...');
                await loadDataFreshness();
            }, 2500);
            
        } else {
            console.error('❌ API returned success=false:', result.message);
            showStatus(`❌ Update failed: ${result.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error updating tax data:', error);
        console.error('❌ Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showStatus('❌ Network error: Cannot connect to API server. Please check if the server is running.', 'error');
        } else if (error.message.includes('HTTP error')) {
            showStatus(`❌ Server error: ${error.message}`, 'error');
        } else {
            showStatus('❌ Error updating tax data. Please check API server connection.', 'error');
        }
    } finally {
        console.log('🔄 Restoring button state...');
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        console.log('✅ Button state restored');
    }
}

// Update the searchTaxes function to use comprehensive rate API
async function searchTaxes() {
    const county = document.getElementById('countySelect').value;
    const city = document.getElementById('citySelect').value;
    
    if (!county) {
        showNotification('Please select a county first.', 'warning');
        return;
    }
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Calculating tax rates...</div>';
    
    try {
        // Use the new comprehensive tax rate API
        const response = await fetch(`/api/tax-data/comprehensive-rate?county=${encodeURIComponent(county)}&city=${encodeURIComponent(city || '')}`);
        const data = await response.json();
        
        if (data.total_rate) {
            displayComprehensiveResults(data);
        } else {
            // Fallback to original method if comprehensive data not available
            const fallbackResponse = await fetch(`/api/tax-data/search?county=${encodeURIComponent(county)}&city=${encodeURIComponent(city || '')}`);
            const fallbackData = await fallbackResponse.json();
            displayResults(fallbackData);
        }
    } catch (error) {
        console.error('Error searching taxes:', error);
        resultsDiv.innerHTML = '<div class="error">Error searching tax data. Please try again.</div>';
    }
}

// New function to display comprehensive tax results
function displayComprehensiveResults(data) {
    const resultsDiv = document.getElementById('results');
    
    const html = `
        <div class="tax-results">
            <div class="location-header">
                <h3><i class="fas fa-map-marker-alt"></i> ${data.location.county} County${data.location.city ? `, ${data.location.city}` : ''}</h3>
            </div>
            
            <div class="total-rate">
                <div class="rate-display">
                    <span class="rate-number">${data.total_percentage}</span>
                    <span class="rate-label">Total Sales Tax Rate</span>
                </div>
            </div>
            
            <div class="rate-breakdown">
                <h4><i class="fas fa-chart-pie"></i> Tax Breakdown</h4>
                <div class="breakdown-grid">
                    ${data.breakdown.state !== '0.000%' ? `
                        <div class="breakdown-item state">
                            <span class="breakdown-label">State Tax</span>
                            <span class="breakdown-rate">${data.breakdown.state}</span>
                        </div>
                    ` : ''}
                    ${data.breakdown.county !== '0.000%' ? `
                        <div class="breakdown-item county">
                            <span class="breakdown-label">County Tax</span>
                            <span class="breakdown-rate">${data.breakdown.county}</span>
                        </div>
                    ` : ''}
                    ${data.breakdown.city !== '0.000%' ? `
                        <div class="breakdown-item city">
                            <span class="breakdown-label">City Tax</span>
                            <span class="breakdown-rate">${data.breakdown.city}</span>
                        </div>
                    ` : ''}
                    ${data.breakdown.special_districts !== '0.000%' ? `
                        <div class="breakdown-item special">
                            <span class="breakdown-label">Special Districts</span>
                            <span class="breakdown-rate">${data.breakdown.special_districts}</span>
                        </div>
                    ` : ''}
                    ${data.breakdown.transit !== '0.000%' ? `
                        <div class="breakdown-item transit">
                            <span class="breakdown-label">Transit Authority</span>
                            <span class="breakdown-rate">${data.breakdown.transit}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${data.details && data.details.length > 0 ? `
                <div class="detailed-breakdown">
                    <h4><i class="fas fa-list-ul"></i> Detailed Tax Authorities</h4>
                    <div class="authorities-list">
                        ${data.details.map(detail => `
                            <div class="authority-item">
                                <div class="authority-info">
                                    <span class="authority-name">${detail.jurisdiction}</span>
                                    <span class="authority-type">${detail.type.replace('_', ' ')}</span>
                                </div>
                                <div class="authority-rate">${detail.rate_percentage}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="data-source">
                <i class="fas fa-info-circle"></i>
                <small>Data sourced from Texas State Comptroller of Public Accounts</small>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

// Show update history modal
function showUpdateHistory() {
    const modal = document.getElementById('updateHistoryModal');
    const content = document.getElementById('updateHistoryContent');
    
    if (modal) {
        modal.style.display = 'block';
        
        // Load update history
        loadUpdateHistory(content);
    }
}

// Close update history modal
function closeUpdateHistory() {
    const modal = document.getElementById('updateHistoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load and display update history
async function loadUpdateHistory(contentElement) {
    try {
        contentElement.innerHTML = '<p>Loading update history...</p>';
        
        // Simulate API call
        // In production, this would call your backend API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockHistory = [
            {
                id: 1,
                update_type: 'automatic',
                status: 'success',
                started_at: '2024-01-15T10:30:00Z',
                records_added: 1250,
                records_updated: 45,
                source_name: 'Texas Comptroller Sales Tax Rates',
                version_number: '2024.1'
            },
            {
                id: 2,
                update_type: 'manual',
                status: 'success',
                started_at: '2024-01-01T09:15:00Z',
                records_added: 1200,
                records_updated: 0,
                source_name: 'Manual Entry',
                version_number: '2024.0'
            }
        ];
        
        displayUpdateHistory(contentElement, mockHistory);
        
    } catch (error) {
        console.error('Error loading update history:', error);
        contentElement.innerHTML = '<p>Error loading update history. Please try again.</p>';
    }
}

// Display update history in the modal
function displayUpdateHistory(contentElement, history) {
    if (!history || history.length === 0) {
        contentElement.innerHTML = '<p>No update history available.</p>';
        return;
    }
    
    const historyHTML = `
        <ul class="update-history-list">
            ${history.map(item => `
                <li class="update-history-item ${item.status}">
                    <div class="update-item-header">
                        <span class="update-item-title">
                            ${item.source_name} (${item.version_number})
                        </span>
                        <span class="update-item-date">
                            ${formatDateTime(item.started_at)}
                        </span>
                    </div>
                    <div class="update-item-details">
                        <strong>Type:</strong> ${capitalizeFirst(item.update_type)} | 
                        <strong>Status:</strong> ${capitalizeFirst(item.status)} | 
                        <strong>Added:</strong> ${item.records_added} records | 
                        <strong>Updated:</strong> ${item.records_updated} records
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
    
    contentElement.innerHTML = historyHTML;
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        let date;
        
        // Handle date-only strings (YYYY-MM-DD) to avoid timezone conversion
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // For date-only strings, create date in local timezone
            const parts = dateString.split('-');
            date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
            // For full datetime strings, use normal parsing
            date = new Date(dateString);
        }
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        // Handle different date formats
        let date;
        if (dateString.includes('T') || dateString.includes('Z')) {
            // ISO format (from API)
            date = new Date(dateString);
        } else {
            // Local format (from database)
            date = new Date(dateString);
        }
        
        // Return in local time format
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('updateHistoryModal');
    if (event.target === modal) {
        closeUpdateHistory();
    }
} 
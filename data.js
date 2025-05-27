// Texas county to city mapping
const countyToCities = {
    // Major Metro Counties
    'harris': ['Alvin', 'Atascocita', 'Baytown', 'Bellaire', 'Bunker Hill Village', 'Clear Lake', 'Cloverleaf', 'Conroe', 'Cypress', 'Deer Park', 'Friendswood', 'Galena Park', 'Hedwig Village', 'Hilshire Village', 'Houston', 'Humble', 'Hunters Creek Village', 'Jacinto City', 'Katy', 'Kemah', 'Kingwood', 'La Porte', 'League City', 'Manvel', 'Missouri City', 'Pasadena', 'Pearland', 'Piney Point Village', 'Seabrook', 'South Houston', 'Southside Place', 'Spring', 'Spring Valley', 'Stafford', 'Sugar Land', 'Tomball', 'West University Place'],
    'dallas': ['Addison', 'Balch Springs', 'Carrollton', 'Cockrell Hill', 'Combine', 'Coppell', 'Dallas', 'DeSoto', 'Duncanville', 'Farmers Branch', 'Garland', 'Glenn Heights', 'Grand Prairie', 'Highland Park', 'Hutchins', 'Irving', 'Lancaster', 'Mesquite', 'Plano', 'Richardson', 'Rowlett', 'Sachse', 'Seagoville', 'Sunnyvale', 'University Park', 'Wilmer'],
    // ... (continuing with all counties - truncated for brevity)
};

// County name mapping for geocoding
const countyNameMapping = {
    'anderson': 'Anderson County',
    'andrews': 'Andrews County',
    'angelina': 'Angelina County',
    'aransas': 'Aransas County',
    'archer': 'Archer County',
    'armstrong': 'Armstrong County',
    'atascosa': 'Atascosa County',
    'austin': 'Austin County',
    // ... (continuing with all counties - truncated for brevity)
}; 
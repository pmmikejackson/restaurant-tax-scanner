const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'taxes.db');
const db = new sqlite3.Database(dbPath);

console.log('Populating cities database...');

// City data from the existing structure
const countyToCities = {
    'harris': ['Alvin', 'Atascocita', 'Baytown', 'Bellaire', 'Bunker Hill Village', 'Clear Lake', 'Cloverleaf', 'Conroe', 'Cypress', 'Deer Park', 'Friendswood', 'Galena Park', 'Hedwig Village', 'Hilshire Village', 'Houston', 'Humble', 'Hunters Creek Village', 'Jacinto City', 'Katy', 'Kemah', 'Kingwood', 'La Porte', 'League City', 'Manvel', 'Missouri City', 'Pasadena', 'Pearland', 'Piney Point Village', 'Seabrook', 'South Houston', 'Southside Place', 'Spring', 'Spring Valley', 'Stafford', 'Sugar Land', 'Tomball', 'West University Place'],
    'dallas': ['Addison', 'Balch Springs', 'Carrollton', 'Cockrell Hill', 'Combine', 'Coppell', 'Dallas', 'DeSoto', 'Duncanville', 'Farmers Branch', 'Garland', 'Glenn Heights', 'Grand Prairie', 'Highland Park', 'Hutchins', 'Irving', 'Lancaster', 'Mesquite', 'Plano', 'Richardson', 'Rowlett', 'Sachse', 'Seagoville', 'Sunnyvale', 'University Park', 'Wilmer'],
    'tarrant': ['Arlington', 'Azle', 'Bedford', 'Benbrook', 'Blue Mound', 'Burleson', 'Carrollton', 'Colleyville', 'Crowley', 'Euless', 'Everman', 'Forest Hill', 'Fort Worth', 'Grand Prairie', 'Grapevine', 'Haltom City', 'Hurst', 'Keller', 'Kennedale', 'Lake Worth', 'Mansfield', 'North Richland Hills', 'Richland Hills', 'River Oaks', 'Saginaw', 'Sansom Park', 'Southlake', 'Watauga', 'Westover Hills', 'Westworth Village', 'White Settlement'],
    'bexar': ['Alamo Heights', 'Balcones Heights', 'Castle Hills', 'China Grove', 'Converse', 'Elmendorf', 'Fair Oaks Ranch', 'Grey Forest', 'Helotes', 'Hill Country Village', 'Hollywood Park', 'Kirby', 'Leon Valley', 'Live Oak', 'Macdona', 'Olmos Park', 'San Antonio', 'Schertz', 'Selma', 'Shavano Park', 'Somerset', 'Terrell Hills', 'Universal City', 'Windcrest'],
    'travis': ['Austin', 'Barton Creek', 'Bee Cave', 'Briarcliff', 'Cedar Park', 'Creedmoor', 'Del Valle', 'Elgin', 'Garfield', 'Hornsby Bend', 'Jonestown', 'Lago Vista', 'Lakeway', 'Manor', 'McNeil', 'Mustang Ridge', 'Pflugerville', 'Point Venture', 'Rollingwood', 'Sunset Valley', 'Volente', 'Wells Branch', 'West Lake Hills'],
    'collin': ['Addison', 'Allen', 'Anna', 'Blue Ridge', 'Carrollton', 'Celina', 'Fairview', 'Farmersville', 'Frisco', 'Garland', 'Josephine', 'Lavon', 'Lowry Crossing', 'Lucas', 'McKinney', 'Melissa', 'Murphy', 'Nevada', 'New Hope', 'Parker', 'Plano', 'Princeton', 'Prosper', 'Richardson', 'Sachse', 'St. Paul', 'Wylie'],
    'hidalgo': ['Alamo', 'Alton', 'Doffing', 'Donna', 'Edcouch', 'Edinburg', 'Elsa', 'Granjeno', 'Hidalgo', 'La Joya', 'La Villa', 'Linn', 'Lopezville', 'McAllen', 'Mercedes', 'Mission', 'Muniz', 'Olivarez', 'Palmhurst', 'Palmview', 'Palmview South', 'Peñitas', 'Pharr', 'Progreso', 'San Juan', 'Sullivan City', 'Weslaco'],
    'denton': ['Bartonville', 'Carrollton', 'Copper Canyon', 'Corinth', 'Coppell', 'Denton', 'Double Oak', 'Flower Mound', 'Frisco', 'Hickory Creek', 'Highland Village', 'Krugerville', 'Lake Dallas', 'Lake Lewisville', 'Lakewood Village', 'Lewisville', 'Little Elm', 'Oak Point', 'Pilot Point', 'Ponder', 'Roanoke', 'Sanger', 'Shady Shores', 'The Colony', 'Trophy Club', 'Westlake'],
    'fort-bend': ['Arcola', 'Beasley', 'Booth', 'Cinco Ranch', 'Cumings', 'Fairchilds', 'Foster', 'Four Corners', 'Fresno', 'Fulshear', 'Guy', 'Hungerford', 'Katy', 'Kendleton', 'Meadows Place', 'Mission Bend', 'Missouri City', 'Needville', 'Orchard', 'Pearland', 'Pecan Grove', 'Pleak', 'Richmond', 'Rosenberg', 'Simonton', 'Stafford', 'Sugar Land', 'Thompsons'],
    'williamson': ['Andice', 'Austin', 'Bartlett', 'Cedar Park', 'Corn Hill', 'Coupland', 'Florence', 'Georgetown', 'Granger', 'Hutto', 'Jarrell', 'Leander', 'Liberty Hill', 'Pflugerville', 'Round Rock', 'Salado', 'Taylor', 'Thrall', 'Walburg', 'Weir']
    // Add more counties as needed - this is a sample of major ones
};

// County slug to ID mapping
const countySlugToId = {};

// First, get all counties and create mapping
db.all('SELECT id, slug FROM counties', [], (err, counties) => {
    if (err) {
        console.error('Error fetching counties:', err);
        return;
    }
    
    counties.forEach(county => {
        countySlugToId[county.slug] = county.id;
    });
    
    console.log(`Found ${counties.length} counties`);
    
    // Now insert cities
    insertCities();
});

function insertCities() {
    const insertCity = db.prepare('INSERT OR IGNORE INTO cities (name, slug, county_id) VALUES (?, ?, ?)');
    let totalCities = 0;
    
    Object.entries(countyToCities).forEach(([countySlug, cities]) => {
        const countyId = countySlugToId[countySlug];
        
        if (!countyId) {
            console.warn(`County not found: ${countySlug}`);
            return;
        }
        
        cities.forEach(cityName => {
            const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            insertCity.run(cityName, citySlug, countyId);
            totalCities++;
        });
        
        console.log(`Added ${cities.length} cities for ${countySlug}`);
    });
    
    insertCity.finalize((err) => {
        if (err) {
            console.error('Error inserting cities:', err);
        } else {
            console.log(`Successfully inserted ${totalCities} cities`);
        }
        
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
} 
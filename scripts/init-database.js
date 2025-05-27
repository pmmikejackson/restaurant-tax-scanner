const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'taxes.db');
const db = new sqlite3.Database(dbPath);

console.log('Initializing database...');

// Create tables
db.serialize(() => {
  // Counties table
  db.run(`
    CREATE TABLE IF NOT EXISTS counties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      region TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cities table
  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      county_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (county_id) REFERENCES counties (id),
      UNIQUE(name, county_id)
    )
  `);

  // Taxes table
  db.run(`
    CREATE TABLE IF NOT EXISTS taxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rate DECIMAL(5,4) NOT NULL,
      description TEXT,
      applies_to TEXT,
      type TEXT NOT NULL CHECK (type IN ('state', 'county', 'city', 'special', 'local')),
      county_id INTEGER,
      city_id INTEGER,
      is_percentage BOOLEAN DEFAULT 1,
      is_active BOOLEAN DEFAULT 1,
      effective_date DATE,
      expiration_date DATE,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (county_id) REFERENCES counties (id),
      FOREIGN KEY (city_id) REFERENCES cities (id)
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tax update logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS tax_update_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
      records_updated INTEGER DEFAULT 0,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Tables created successfully');
});

// Insert initial data
const insertInitialData = () => {
  console.log('Inserting initial data...');

  // Texas counties data
  const counties = [
    { name: 'Anderson County', slug: 'anderson', region: 'East Texas' },
    { name: 'Andrews County', slug: 'andrews', region: 'West Texas' },
    { name: 'Angelina County', slug: 'angelina', region: 'East Texas' },
    { name: 'Aransas County', slug: 'aransas', region: 'Coastal' },
    { name: 'Archer County', slug: 'archer', region: 'North Texas' },
    { name: 'Armstrong County', slug: 'armstrong', region: 'Panhandle' },
    { name: 'Atascosa County', slug: 'atascosa', region: 'South Texas' },
    { name: 'Austin County', slug: 'austin', region: 'Southeast Texas' },
    { name: 'Bailey County', slug: 'bailey', region: 'Panhandle' },
    { name: 'Bandera County', slug: 'bandera', region: 'Hill Country' },
    { name: 'Bastrop County', slug: 'bastrop', region: 'Central Texas' },
    { name: 'Baylor County', slug: 'baylor', region: 'North Texas' },
    { name: 'Bee County', slug: 'bee', region: 'South Texas' },
    { name: 'Bell County', slug: 'bell', region: 'Central Texas' },
    { name: 'Bexar County', slug: 'bexar', region: 'South Texas' },
    { name: 'Blanco County', slug: 'blanco', region: 'Hill Country' },
    { name: 'Borden County', slug: 'borden', region: 'West Texas' },
    { name: 'Bosque County', slug: 'bosque', region: 'Central Texas' },
    { name: 'Bowie County', slug: 'bowie', region: 'East Texas' },
    { name: 'Brazoria County', slug: 'brazoria', region: 'Southeast Texas' },
    { name: 'Brazos County', slug: 'brazos', region: 'Central Texas' },
    { name: 'Brewster County', slug: 'brewster', region: 'West Texas' },
    { name: 'Briscoe County', slug: 'briscoe', region: 'Panhandle' },
    { name: 'Brown County', slug: 'brown', region: 'Central Texas' },
    { name: 'Burleson County', slug: 'burleson', region: 'Central Texas' },
    { name: 'Burnet County', slug: 'burnet', region: 'Hill Country' },
    { name: 'Caldwell County', slug: 'caldwell', region: 'Central Texas' },
    { name: 'Calhoun County', slug: 'calhoun', region: 'Coastal' },
    { name: 'Callahan County', slug: 'callahan', region: 'West Texas' },
    { name: 'Cameron County', slug: 'cameron', region: 'Rio Grande Valley' },
    { name: 'Camp County', slug: 'camp', region: 'East Texas' },
    { name: 'Carson County', slug: 'carson', region: 'Panhandle' },
    { name: 'Cass County', slug: 'cass', region: 'East Texas' },
    { name: 'Castro County', slug: 'castro', region: 'Panhandle' },
    { name: 'Chambers County', slug: 'chambers', region: 'Southeast Texas' },
    { name: 'Cherokee County', slug: 'cherokee', region: 'East Texas' },
    { name: 'Childress County', slug: 'childress', region: 'Panhandle' },
    { name: 'Clay County', slug: 'clay', region: 'North Texas' },
    { name: 'Cochran County', slug: 'cochran', region: 'Panhandle' },
    { name: 'Coke County', slug: 'coke', region: 'West Texas' },
    { name: 'Coleman County', slug: 'coleman', region: 'West Texas' },
    { name: 'Collin County', slug: 'collin', region: 'North Texas' },
    { name: 'Collingsworth County', slug: 'collingsworth', region: 'Panhandle' },
    { name: 'Colorado County', slug: 'colorado', region: 'Southeast Texas' },
    { name: 'Comal County', slug: 'comal', region: 'Hill Country' },
    { name: 'Comanche County', slug: 'comanche', region: 'Central Texas' },
    { name: 'Concho County', slug: 'concho', region: 'West Texas' },
    { name: 'Cooke County', slug: 'cooke', region: 'North Texas' },
    { name: 'Coryell County', slug: 'coryell', region: 'Central Texas' },
    { name: 'Cottle County', slug: 'cottle', region: 'Panhandle' },
    { name: 'Crane County', slug: 'crane', region: 'West Texas' },
    { name: 'Crockett County', slug: 'crockett', region: 'West Texas' },
    { name: 'Crosby County', slug: 'crosby', region: 'Panhandle' },
    { name: 'Culberson County', slug: 'culberson', region: 'West Texas' },
    { name: 'Dallam County', slug: 'dallam', region: 'Panhandle' },
    { name: 'Dallas County', slug: 'dallas', region: 'North Texas' },
    { name: 'Dawson County', slug: 'dawson', region: 'West Texas' },
    { name: 'Deaf Smith County', slug: 'deaf-smith', region: 'Panhandle' },
    { name: 'Delta County', slug: 'delta', region: 'East Texas' },
    { name: 'Denton County', slug: 'denton', region: 'North Texas' },
    { name: 'DeWitt County', slug: 'dewitt', region: 'South Texas' },
    { name: 'Dickens County', slug: 'dickens', region: 'West Texas' },
    { name: 'Donley County', slug: 'donley', region: 'Panhandle' },
    { name: 'Eastland County', slug: 'eastland', region: 'West Texas' },
    { name: 'Ector County', slug: 'ector', region: 'West Texas' },
    { name: 'Edwards County', slug: 'edwards', region: 'West Texas' },
    { name: 'El Paso County', slug: 'el-paso', region: 'West Texas' },
    { name: 'Ellis County', slug: 'ellis', region: 'North Texas' },
    { name: 'Erath County', slug: 'erath', region: 'Central Texas' },
    { name: 'Falls County', slug: 'falls', region: 'Central Texas' },
    { name: 'Fannin County', slug: 'fannin', region: 'East Texas' },
    { name: 'Fayette County', slug: 'fayette', region: 'Central Texas' },
    { name: 'Fisher County', slug: 'fisher', region: 'West Texas' },
    { name: 'Floyd County', slug: 'floyd', region: 'Panhandle' },
    { name: 'Foard County', slug: 'foard', region: 'North Texas' },
    { name: 'Fort Bend County', slug: 'fort-bend', region: 'Southeast Texas' },
    { name: 'Franklin County', slug: 'franklin', region: 'East Texas' },
    { name: 'Freestone County', slug: 'freestone', region: 'East Texas' },
    { name: 'Frio County', slug: 'frio', region: 'South Texas' },
    { name: 'Gaines County', slug: 'gaines', region: 'West Texas' },
    { name: 'Galveston County', slug: 'galveston', region: 'Southeast Texas' },
    { name: 'Garza County', slug: 'garza', region: 'West Texas' },
    { name: 'Gillespie County', slug: 'gillespie', region: 'Hill Country' },
    { name: 'Glasscock County', slug: 'glasscock', region: 'West Texas' },
    { name: 'Goliad County', slug: 'goliad', region: 'South Texas' },
    { name: 'Gonzales County', slug: 'gonzales', region: 'South Texas' },
    { name: 'Gray County', slug: 'gray', region: 'Panhandle' },
    { name: 'Grayson County', slug: 'grayson', region: 'North Texas' },
    { name: 'Gregg County', slug: 'gregg', region: 'East Texas' },
    { name: 'Grimes County', slug: 'grimes', region: 'Southeast Texas' },
    { name: 'Guadalupe County', slug: 'guadalupe', region: 'South Texas' },
    { name: 'Hale County', slug: 'hale', region: 'Panhandle' },
    { name: 'Hall County', slug: 'hall', region: 'Panhandle' },
    { name: 'Hamilton County', slug: 'hamilton', region: 'Central Texas' },
    { name: 'Hansford County', slug: 'hansford', region: 'Panhandle' },
    { name: 'Hardeman County', slug: 'hardeman', region: 'North Texas' },
    { name: 'Hardin County', slug: 'hardin', region: 'Southeast Texas' },
    { name: 'Harris County', slug: 'harris', region: 'Southeast Texas' },
    { name: 'Harrison County', slug: 'harrison', region: 'East Texas' },
    { name: 'Hartley County', slug: 'hartley', region: 'Panhandle' },
    { name: 'Haskell County', slug: 'haskell', region: 'West Texas' },
    { name: 'Hays County', slug: 'hays', region: 'Central Texas' },
    { name: 'Hemphill County', slug: 'hemphill', region: 'Panhandle' },
    { name: 'Henderson County', slug: 'henderson', region: 'East Texas' },
    { name: 'Hidalgo County', slug: 'hidalgo', region: 'Rio Grande Valley' },
    { name: 'Hill County', slug: 'hill', region: 'Central Texas' },
    { name: 'Hockley County', slug: 'hockley', region: 'West Texas' },
    { name: 'Hood County', slug: 'hood', region: 'North Texas' },
    { name: 'Hopkins County', slug: 'hopkins', region: 'East Texas' },
    { name: 'Houston County', slug: 'houston', region: 'East Texas' },
    { name: 'Howard County', slug: 'howard', region: 'West Texas' },
    { name: 'Hudspeth County', slug: 'hudspeth', region: 'West Texas' },
    { name: 'Hunt County', slug: 'hunt', region: 'East Texas' },
    { name: 'Hutchinson County', slug: 'hutchinson', region: 'Panhandle' },
    { name: 'Irion County', slug: 'irion', region: 'West Texas' },
    { name: 'Jack County', slug: 'jack', region: 'North Texas' },
    { name: 'Jackson County', slug: 'jackson', region: 'Coastal' },
    { name: 'Jasper County', slug: 'jasper', region: 'East Texas' },
    { name: 'Jeff Davis County', slug: 'jeff-davis', region: 'West Texas' },
    { name: 'Jefferson County', slug: 'jefferson', region: 'Southeast Texas' },
    { name: 'Johnson County', slug: 'johnson', region: 'North Texas' },
    { name: 'Jones County', slug: 'jones', region: 'West Texas' },
    { name: 'Karnes County', slug: 'karnes', region: 'South Texas' },
    { name: 'Kaufman County', slug: 'kaufman', region: 'North Texas' },
    { name: 'Kendall County', slug: 'kendall', region: 'Hill Country' },
    { name: 'Kenedy County', slug: 'kenedy', region: 'South Texas' },
    { name: 'Kent County', slug: 'kent', region: 'West Texas' },
    { name: 'Kerr County', slug: 'kerr', region: 'Hill Country' },
    { name: 'Kimble County', slug: 'kimble', region: 'Hill Country' },
    { name: 'King County', slug: 'king', region: 'West Texas' },
    { name: 'Kinney County', slug: 'kinney', region: 'South Texas' },
    { name: 'Kleberg County', slug: 'kleberg', region: 'South Texas' },
    { name: 'Knox County', slug: 'knox', region: 'North Texas' },
    { name: 'La Salle County', slug: 'la-salle', region: 'South Texas' },
    { name: 'Lamar County', slug: 'lamar', region: 'East Texas' },
    { name: 'Lamb County', slug: 'lamb', region: 'Panhandle' },
    { name: 'Lampasas County', slug: 'lampasas', region: 'Central Texas' },
    { name: 'Lavaca County', slug: 'lavaca', region: 'Southeast Texas' },
    { name: 'Lee County', slug: 'lee', region: 'Central Texas' },
    { name: 'Leon County', slug: 'leon', region: 'East Texas' },
    { name: 'Liberty County', slug: 'liberty', region: 'Southeast Texas' },
    { name: 'Limestone County', slug: 'limestone', region: 'Central Texas' },
    { name: 'Lipscomb County', slug: 'lipscomb', region: 'Panhandle' },
    { name: 'Live Oak County', slug: 'live-oak', region: 'South Texas' },
    { name: 'Llano County', slug: 'llano', region: 'Hill Country' },
    { name: 'Loving County', slug: 'loving', region: 'West Texas' },
    { name: 'Lubbock County', slug: 'lubbock', region: 'West Texas' },
    { name: 'Lynn County', slug: 'lynn', region: 'West Texas' },
    { name: 'Madison County', slug: 'madison', region: 'East Texas' },
    { name: 'Marion County', slug: 'marion', region: 'East Texas' },
    { name: 'Martin County', slug: 'martin', region: 'West Texas' },
    { name: 'Mason County', slug: 'mason', region: 'Hill Country' },
    { name: 'Matagorda County', slug: 'matagorda', region: 'Coastal' },
    { name: 'Maverick County', slug: 'maverick', region: 'South Texas' },
    { name: 'McCulloch County', slug: 'mcculloch', region: 'Central Texas' },
    { name: 'McLennan County', slug: 'mclennan', region: 'Central Texas' },
    { name: 'McMullen County', slug: 'mcmullen', region: 'South Texas' },
    { name: 'Medina County', slug: 'medina', region: 'South Texas' },
    { name: 'Menard County', slug: 'menard', region: 'West Texas' },
    { name: 'Midland County', slug: 'midland', region: 'West Texas' },
    { name: 'Milam County', slug: 'milam', region: 'Central Texas' },
    { name: 'Mills County', slug: 'mills', region: 'Central Texas' },
    { name: 'Mitchell County', slug: 'mitchell', region: 'West Texas' },
    { name: 'Montague County', slug: 'montague', region: 'North Texas' },
    { name: 'Montgomery County', slug: 'montgomery', region: 'Southeast Texas' },
    { name: 'Moore County', slug: 'moore', region: 'Panhandle' },
    { name: 'Morris County', slug: 'morris', region: 'East Texas' },
    { name: 'Motley County', slug: 'motley', region: 'Panhandle' },
    { name: 'Nacogdoches County', slug: 'nacogdoches', region: 'East Texas' },
    { name: 'Navarro County', slug: 'navarro', region: 'Central Texas' },
    { name: 'Newton County', slug: 'newton', region: 'East Texas' },
    { name: 'Nolan County', slug: 'nolan', region: 'West Texas' },
    { name: 'Nueces County', slug: 'nueces', region: 'Coastal' },
    { name: 'Ochiltree County', slug: 'ochiltree', region: 'Panhandle' },
    { name: 'Oldham County', slug: 'oldham', region: 'Panhandle' },
    { name: 'Orange County', slug: 'orange', region: 'Southeast Texas' },
    { name: 'Palo Pinto County', slug: 'palo-pinto', region: 'North Texas' },
    { name: 'Panola County', slug: 'panola', region: 'East Texas' },
    { name: 'Parker County', slug: 'parker', region: 'North Texas' },
    { name: 'Parmer County', slug: 'parmer', region: 'Panhandle' },
    { name: 'Pecos County', slug: 'pecos', region: 'West Texas' },
    { name: 'Polk County', slug: 'polk', region: 'East Texas' },
    { name: 'Potter County', slug: 'potter', region: 'Panhandle' },
    { name: 'Presidio County', slug: 'presidio', region: 'West Texas' },
    { name: 'Rains County', slug: 'rains', region: 'East Texas' },
    { name: 'Randall County', slug: 'randall', region: 'Panhandle' },
    { name: 'Reagan County', slug: 'reagan', region: 'West Texas' },
    { name: 'Real County', slug: 'real', region: 'Hill Country' },
    { name: 'Red River County', slug: 'red-river', region: 'East Texas' },
    { name: 'Reeves County', slug: 'reeves', region: 'West Texas' },
    { name: 'Refugio County', slug: 'refugio', region: 'Coastal' },
    { name: 'Roberts County', slug: 'roberts', region: 'Panhandle' },
    { name: 'Robertson County', slug: 'robertson', region: 'Central Texas' },
    { name: 'Rockwall County', slug: 'rockwall', region: 'North Texas' },
    { name: 'Runnels County', slug: 'runnels', region: 'West Texas' },
    { name: 'Rusk County', slug: 'rusk', region: 'East Texas' },
    { name: 'Sabine County', slug: 'sabine', region: 'East Texas' },
    { name: 'San Augustine County', slug: 'san-augustine', region: 'East Texas' },
    { name: 'San Jacinto County', slug: 'san-jacinto', region: 'Southeast Texas' },
    { name: 'San Patricio County', slug: 'san-patricio', region: 'Coastal' },
    { name: 'San Saba County', slug: 'san-saba', region: 'Central Texas' },
    { name: 'Schleicher County', slug: 'schleicher', region: 'West Texas' },
    { name: 'Scurry County', slug: 'scurry', region: 'West Texas' },
    { name: 'Shackelford County', slug: 'shackelford', region: 'West Texas' },
    { name: 'Shelby County', slug: 'shelby', region: 'East Texas' },
    { name: 'Sherman County', slug: 'sherman', region: 'Panhandle' },
    { name: 'Smith County', slug: 'smith', region: 'East Texas' },
    { name: 'Somervell County', slug: 'somervell', region: 'North Texas' },
    { name: 'Starr County', slug: 'starr', region: 'Rio Grande Valley' },
    { name: 'Stephens County', slug: 'stephens', region: 'West Texas' },
    { name: 'Sterling County', slug: 'sterling', region: 'West Texas' },
    { name: 'Stonewall County', slug: 'stonewall', region: 'West Texas' },
    { name: 'Sutton County', slug: 'sutton', region: 'West Texas' },
    { name: 'Swisher County', slug: 'swisher', region: 'Panhandle' },
    { name: 'Tarrant County', slug: 'tarrant', region: 'North Texas' },
    { name: 'Taylor County', slug: 'taylor', region: 'West Texas' },
    { name: 'Terrell County', slug: 'terrell', region: 'West Texas' },
    { name: 'Terry County', slug: 'terry', region: 'West Texas' },
    { name: 'Throckmorton County', slug: 'throckmorton', region: 'North Texas' },
    { name: 'Titus County', slug: 'titus', region: 'East Texas' },
    { name: 'Tom Green County', slug: 'tom-green', region: 'West Texas' },
    { name: 'Travis County', slug: 'travis', region: 'Central Texas' },
    { name: 'Trinity County', slug: 'trinity', region: 'East Texas' },
    { name: 'Tyler County', slug: 'tyler', region: 'East Texas' },
    { name: 'Upshur County', slug: 'upshur', region: 'East Texas' },
    { name: 'Upton County', slug: 'upton', region: 'West Texas' },
    { name: 'Uvalde County', slug: 'uvalde', region: 'South Texas' },
    { name: 'Val Verde County', slug: 'val-verde', region: 'South Texas' },
    { name: 'Van Zandt County', slug: 'van-zandt', region: 'East Texas' },
    { name: 'Victoria County', slug: 'victoria', region: 'Coastal' },
    { name: 'Walker County', slug: 'walker', region: 'East Texas' },
    { name: 'Waller County', slug: 'waller', region: 'Southeast Texas' },
    { name: 'Ward County', slug: 'ward', region: 'West Texas' },
    { name: 'Washington County', slug: 'washington', region: 'Southeast Texas' },
    { name: 'Webb County', slug: 'webb', region: 'South Texas' },
    { name: 'Wharton County', slug: 'wharton', region: 'Southeast Texas' },
    { name: 'Wheeler County', slug: 'wheeler', region: 'Panhandle' },
    { name: 'Wichita County', slug: 'wichita', region: 'North Texas' },
    { name: 'Wilbarger County', slug: 'wilbarger', region: 'North Texas' },
    { name: 'Willacy County', slug: 'willacy', region: 'Rio Grande Valley' },
    { name: 'Williamson County', slug: 'williamson', region: 'Central Texas' },
    { name: 'Wilson County', slug: 'wilson', region: 'South Texas' },
    { name: 'Winkler County', slug: 'winkler', region: 'West Texas' },
    { name: 'Wise County', slug: 'wise', region: 'North Texas' },
    { name: 'Wood County', slug: 'wood', region: 'East Texas' },
    { name: 'Yoakum County', slug: 'yoakum', region: 'West Texas' },
    { name: 'Young County', slug: 'young', region: 'North Texas' },
    { name: 'Zapata County', slug: 'zapata', region: 'South Texas' },
    { name: 'Zavala County', slug: 'zavala', region: 'South Texas' }
  ];

  // Insert counties
  const insertCounty = db.prepare('INSERT OR IGNORE INTO counties (name, slug, region) VALUES (?, ?, ?)');
  counties.forEach(county => {
    insertCounty.run(county.name, county.slug, county.region);
  });
  insertCounty.finalize();

  // Insert state-level tax
  db.run(`
    INSERT OR IGNORE INTO taxes (
      name, rate, description, applies_to, type, is_percentage, is_active
    ) VALUES (
      'Texas State Sales Tax', 6.25, 'Statewide sales tax applied to all taxable sales', 
      'All food and beverage sales', 'state', 1, 1
    )
  `);

  // Create default admin user (password: admin123)
  bcrypt.hash('admin123', 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
    
    db.run(`
      INSERT OR IGNORE INTO admin_users (username, password_hash, email) 
      VALUES ('admin', ?, 'admin@example.com')
    `, [hash], (err) => {
      if (err) {
        console.error('Error creating admin user:', err);
      } else {
        console.log('Default admin user created (username: admin, password: admin123)');
      }
    });
  });

  console.log('Initial data inserted successfully');
  console.log('Database initialization complete!');
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
};

// Wait a moment for tables to be created, then insert data
setTimeout(insertInitialData, 1000); 
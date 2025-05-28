#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Netlify deployment...');

// Create directories if they don't exist
const functionsDir = path.join(__dirname, 'netlify', 'functions');
const apiDir = path.join(functionsDir, 'api');

if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Copy API files to functions directory
const apiFiles = [
    'tax-data-manager.js',
    'texas-tax-importer.js'
];

apiFiles.forEach(file => {
    const src = path.join(__dirname, 'api', file);
    const dest = path.join(apiDir, file);
    
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✅ Copied ${file} to functions/api/`);
    } else {
        console.warn(`⚠️  ${file} not found in api directory`);
    }
});

// Copy database file
const dbSrc = path.join(__dirname, 'tax_database.db');
const dbDest = path.join(functionsDir, 'tax_database.db');

if (fs.existsSync(dbSrc)) {
    fs.copyFileSync(dbSrc, dbDest);
    console.log('✅ Copied database to functions directory');
} else {
    console.warn('⚠️  Database file not found');
}

// Update require paths in the utility file
const utilsFile = path.join(functionsDir, 'utils', 'tax-manager.js');
if (fs.existsSync(utilsFile)) {
    let content = fs.readFileSync(utilsFile, 'utf8');
    content = content.replace(
        "require('../../../api/tax-data-manager')",
        "require('../api/tax-data-manager')"
    );
    fs.writeFileSync(utilsFile, content);
    console.log('✅ Updated require paths in utils/tax-manager.js');
}

console.log('🎉 Netlify build preparation complete!');
console.log('');
console.log('Next steps:');
console.log('1. Commit and push your changes to GitHub');
console.log('2. Connect your GitHub repo to Netlify');
console.log('3. Set build command to: node build-netlify.js');
console.log('4. Set publish directory to: .');
console.log('5. Deploy!'); 
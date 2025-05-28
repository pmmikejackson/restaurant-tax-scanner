#!/usr/bin/env node

const TexasTaxImporter = require('../api/texas-tax-importer');

async function main() {
    const importer = new TexasTaxImporter();
    
    try {
        console.log('🏛️  Texas Tax Rate Importer');
        console.log('============================\n');
        
        // Run the import
        const result = await importer.updateTaxRates();
        
        console.log('\n✅ Import completed successfully!');
        console.log(`📊 Results: ${result.imported} imported, ${result.updated} updated, ${result.errors} errors\n`);
        
        // Test with Rockwall County specifically
        console.log('🔍 Testing Rockwall County rates...');
        await importer.connect();
        
        const rockwallRate = await importer.getRateForJurisdiction('Rockwall');
        if (rockwallRate) {
            console.log('📍 Rockwall County Tax Information:');
            console.log(`   Jurisdiction: ${rockwallRate.jurisdiction_name}`);
            console.log(`   Type: ${rockwallRate.jurisdiction_type}`);
            console.log(`   Rate: ${rockwallRate.rate}%`);
            console.log(`   Effective Date: ${rockwallRate.effective_date || 'N/A'}`);
            console.log(`   Authority: ${rockwallRate.authority_name}`);
        } else {
            console.log('❌ No rate found for Rockwall County');
        }
        
        // Test with a few other counties
        const testCounties = ['Harris', 'Dallas', 'Travis', 'Collin'];
        console.log('\n🧪 Testing other major counties...');
        
        for (const county of testCounties) {
            const rate = await importer.getRateForJurisdiction(county);
            if (rate) {
                console.log(`   ${county}: ${rate.rate}% (${rate.jurisdiction_type})`);
            } else {
                console.log(`   ${county}: Not found`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error during import:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        await importer.close();
    }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Texas Tax Rate Importer

Usage: node scripts/import-texas-rates.js [options]

Options:
  --help, -h     Show this help message
  --test, -t     Run in test mode (download but don't import)
  --county <name> Test specific county rate lookup

Examples:
  node scripts/import-texas-rates.js
  node scripts/import-texas-rates.js --county Rockwall
    `);
    process.exit(0);
}

if (process.argv.includes('--county')) {
    const countyIndex = process.argv.indexOf('--county');
    const countyName = process.argv[countyIndex + 1];
    
    if (!countyName) {
        console.error('❌ Please specify a county name after --county');
        process.exit(1);
    }
    
    // Just test the county lookup
    (async () => {
        const importer = new TexasTaxImporter();
        try {
            await importer.connect();
            const rate = await importer.getRateForJurisdiction(countyName);
            
            if (rate) {
                console.log(`📍 ${countyName} County Tax Information:`);
                console.log(`   Jurisdiction: ${rate.jurisdiction_name}`);
                console.log(`   Type: ${rate.jurisdiction_type}`);
                console.log(`   Rate: ${rate.rate}%`);
                console.log(`   Effective Date: ${rate.effective_date || 'N/A'}`);
                console.log(`   Authority: ${rate.authority_name}`);
            } else {
                console.log(`❌ No rate found for ${countyName} County`);
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        } finally {
            await importer.close();
        }
    })();
} else {
    main();
}
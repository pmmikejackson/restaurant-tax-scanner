// Tax Data Management API
// Handles database operations, data updates, and version management

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class TaxDataManager {
    constructor(dbPath = './tax_database.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // Initialize database connection
    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Connected to tax database');
                    resolve();
                }
            });
        });
    }

    // Close database connection
    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    resolve();
                }
            });
        });
    }

    // Get all counties for a state
    async getCounties(stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id, c.name, c.slug, c.fips_code
                FROM counties c
                JOIN states s ON c.state_id = s.id
                WHERE s.code = ?
                ORDER BY c.name
            `;
            
            this.db.all(query, [stateCode], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get cities for a county
    async getCities(countySlug, stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ci.id, ci.name, ci.slug, ci.population
                FROM cities ci
                JOIN counties co ON ci.county_id = co.id
                JOIN states s ON co.state_id = s.id
                WHERE co.slug = ? AND s.code = ?
                ORDER BY ci.name
            `;
            
            this.db.all(query, [countySlug, stateCode], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get current tax data for a location
    async getTaxesForLocation(countySlug, citySlug = null, stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    t.id,
                    t.name,
                    t.rate,
                    t.is_percentage,
                    t.applies_to,
                    t.description,
                    t.effective_date,
                    t.expiration_date,
                    ta.name as authority_name,
                    tt.name as tax_type,
                    tdv.version_number,
                    tdv.source_date,
                    tdv.imported_date
                FROM taxes t
                JOIN tax_authorities ta ON t.authority_id = ta.id
                JOIN tax_types tt ON ta.type_id = tt.id
                JOIN tax_data_versions tdv ON t.version_id = tdv.id
                JOIN tax_jurisdictions tj ON t.id = tj.tax_id
                LEFT JOIN counties co ON tj.county_id = co.id
                LEFT JOIN cities ci ON tj.city_id = ci.id
                LEFT JOIN states s ON tj.state_id = s.id
                WHERE tdv.is_active = 1
                AND (
                    (s.code = ? AND tj.county_id IS NULL AND tj.city_id IS NULL) OR
                    (co.slug = ? AND tj.city_id IS NULL) OR
                    (ci.slug = ? AND co.slug = ?)
                )
                ORDER BY tt.name, t.name
            `;
            
            this.db.all(query, [stateCode, countySlug, citySlug, countySlug], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get current data version info
    async getCurrentDataVersion(stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    tdv.*,
                    s.name as state_name,
                    COUNT(t.id) as tax_count
                FROM tax_data_versions tdv
                JOIN states s ON tdv.state_id = s.id
                LEFT JOIN taxes t ON tdv.id = t.version_id
                WHERE s.code = ? AND tdv.is_active = 1
                GROUP BY tdv.id
                ORDER BY tdv.imported_date DESC
                LIMIT 1
            `;
            
            this.db.get(query, [stateCode], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Create new data version
    async createDataVersion(stateCode, sourceUrl, sourceDate, importedBy, notes) {
        return new Promise((resolve, reject) => {
            // First deactivate current version
            const deactivateQuery = `
                UPDATE tax_data_versions 
                SET is_active = 0 
                WHERE state_id = (SELECT id FROM states WHERE code = ?)
            `;
            
            this.db.run(deactivateQuery, [stateCode], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Create new version
                const versionNumber = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
                const insertQuery = `
                    INSERT INTO tax_data_versions 
                    (version_number, state_id, source_url, source_date, imported_by, notes)
                    VALUES (?, (SELECT id FROM states WHERE code = ?), ?, ?, ?, ?)
                `;
                
                this.db.run(insertQuery, [versionNumber, stateCode, sourceUrl, sourceDate, importedBy, notes], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            });
        });
    }

    // Log update operation
    async logUpdate(sourceId, versionId, updateType, recordsUpdated = 0, recordsAdded = 0, recordsDeleted = 0, status = 'success', errorMessage = null) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO update_logs 
                (source_id, version_id, update_type, records_updated, records_added, records_deleted, status, error_message, completed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `;
            
            this.db.run(query, [sourceId, versionId, updateType, recordsUpdated, recordsAdded, recordsDeleted, status, errorMessage], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // Get update history
    async getUpdateHistory(stateCode = 'TX', limit = 10) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    ul.*,
                    ds.name as source_name,
                    tdv.version_number,
                    s.name as state_name
                FROM update_logs ul
                LEFT JOIN data_sources ds ON ul.source_id = ds.id
                LEFT JOIN tax_data_versions tdv ON ul.version_id = tdv.id
                LEFT JOIN states s ON tdv.state_id = s.id
                WHERE s.code = ? OR s.code IS NULL
                ORDER BY ul.started_at DESC
                LIMIT ?
            `;
            
            this.db.all(query, [stateCode, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Bulk insert taxes for a version
    async insertTaxes(versionId, taxesData) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO taxes 
                (version_id, authority_id, name, rate, is_percentage, applies_to, description, effective_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            let insertedCount = 0;
            let errors = [];
            
            taxesData.forEach((tax, index) => {
                stmt.run([
                    versionId,
                    tax.authority_id,
                    tax.name,
                    tax.rate,
                    tax.is_percentage,
                    tax.applies_to,
                    tax.description,
                    tax.effective_date
                ], function(err) {
                    if (err) {
                        errors.push({ index, error: err.message });
                    } else {
                        insertedCount++;
                    }
                    
                    // Check if all operations completed
                    if (insertedCount + errors.length === taxesData.length) {
                        stmt.finalize();
                        if (errors.length > 0) {
                            reject({ insertedCount, errors });
                        } else {
                            resolve(insertedCount);
                        }
                    }
                });
            });
        });
    }

    // Search counties by name
    async searchCounties(searchTerm, stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id, c.name, c.slug
                FROM counties c
                JOIN states s ON c.state_id = s.id
                WHERE s.code = ? AND c.name LIKE ?
                ORDER BY c.name
                LIMIT 20
            `;
            
            this.db.all(query, [stateCode, `%${searchTerm.toUpperCase()}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get data freshness info
    async getDataFreshness(stateCode = 'TX') {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    tdv.source_date,
                    tdv.imported_date,
                    ds.name as source_name,
                    ds.update_frequency,
                    ds.last_checked,
                    CASE 
                        WHEN ds.update_frequency = 'daily' THEN 1
                        WHEN ds.update_frequency = 'weekly' THEN 7
                        WHEN ds.update_frequency = 'monthly' THEN 30
                        WHEN ds.update_frequency = 'quarterly' THEN 90
                        ELSE 365
                    END as update_frequency_days,
                    julianday('now') - julianday(tdv.imported_date) as days_since_import
                FROM tax_data_versions tdv
                JOIN states s ON tdv.state_id = s.id
                LEFT JOIN update_logs ul ON tdv.id = ul.version_id
                LEFT JOIN data_sources ds ON ul.source_id = ds.id
                WHERE s.code = ? AND tdv.is_active = 1
                ORDER BY ul.started_at DESC
                LIMIT 1
            `;
            
            this.db.get(query, [stateCode], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = TaxDataManager; 
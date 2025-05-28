const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Database setup
const dbPath = path.join(__dirname, 'database', 'taxes.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes

// Get all counties
app.get('/api/counties', (req, res) => {
  const query = `
    SELECT DISTINCT c.id, c.name, c.slug, c.region
    FROM counties c
    ORDER BY c.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get cities by county
app.get('/api/counties/:countyId/cities', (req, res) => {
  const { countyId } = req.params;
  
  const query = `
    SELECT id, name, slug, county_id
    FROM cities
    WHERE county_id = ?
    ORDER BY name
  `;
  
  db.all(query, [countyId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get tax rates for a location
app.get('/api/taxes/:countyId/:cityId?', (req, res) => {
  const { countyId, cityId } = req.params;
  
  let query = `
    SELECT 
      t.id,
      t.name,
      t.rate,
      t.description,
      t.applies_to,
      t.type,
      t.is_percentage,
      t.is_active,
      t.effective_date,
      t.expiration_date,
      t.last_updated
    FROM taxes t
    WHERE t.is_active = 1 
    AND (t.county_id = ? OR t.county_id IS NULL)
    AND (t.effective_date IS NULL OR t.effective_date <= date('now'))
    AND (t.expiration_date IS NULL OR t.expiration_date > date('now'))
  `;
  
  const params = [countyId];
  
  if (cityId) {
    query += ` AND (t.city_id = ? OR t.city_id IS NULL)`;
    params.push(cityId);
  } else {
    query += ` AND t.city_id IS NULL`;
  }
  
  query += ` ORDER BY t.type, t.name`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Calculate total rate
    const totalRate = rows
      .filter(tax => tax.is_percentage)
      .reduce((sum, tax) => sum + parseFloat(tax.rate), 0);
    
    res.json({
      taxes: rows,
      totalRate: totalRate,
      location: { countyId, cityId }
    });
  });
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const query = 'SELECT * FROM admin_users WHERE username = ?';
  
  db.get(query, [username], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: user.username });
  });
});

// Get all taxes (admin only)
app.get('/api/admin/taxes', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      t.*,
      c.name as county_name,
      ci.name as city_name
    FROM taxes t
    LEFT JOIN counties c ON t.county_id = c.id
    LEFT JOIN cities ci ON t.city_id = ci.id
    ORDER BY t.last_updated DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create new tax (admin only)
app.post('/api/admin/taxes', authenticateToken, (req, res) => {
  const {
    name, rate, description, applies_to, type,
    county_id, city_id, is_percentage, effective_date, expiration_date
  } = req.body;
  
  const query = `
    INSERT INTO taxes (
      name, rate, description, applies_to, type,
      county_id, city_id, is_percentage, effective_date, expiration_date,
      is_active, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
  `;
  
  const params = [
    name, rate, description, applies_to, type,
    county_id || null, city_id || null, is_percentage ? 1 : 0,
    effective_date || null, expiration_date || null
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, message: 'Tax created successfully' });
  });
});

// Update tax (admin only)
app.put('/api/admin/taxes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    name, rate, description, applies_to, type,
    county_id, city_id, is_percentage, is_active,
    effective_date, expiration_date
  } = req.body;
  
  const query = `
    UPDATE taxes SET
      name = ?, rate = ?, description = ?, applies_to = ?, type = ?,
      county_id = ?, city_id = ?, is_percentage = ?, is_active = ?,
      effective_date = ?, expiration_date = ?, last_updated = datetime('now')
    WHERE id = ?
  `;
  
  const params = [
    name, rate, description, applies_to, type,
    county_id || null, city_id || null, is_percentage ? 1 : 0, is_active ? 1 : 0,
    effective_date || null, expiration_date || null, id
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Tax updated successfully' });
  });
});

// Delete tax (admin only)
app.delete('/api/admin/taxes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const query = 'UPDATE taxes SET is_active = 0, last_updated = datetime(\'now\') WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Tax deactivated successfully' });
  });
});

// Bulk update taxes from external sources (admin only)
app.post('/api/admin/update-taxes', authenticateToken, async (req, res) => {
  try {
    // This would integrate with Texas Comptroller API or other sources
    // For now, we'll return a placeholder response
    res.json({ 
      message: 'Tax update initiated',
      updated: 0,
      errors: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Main app: http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app; 
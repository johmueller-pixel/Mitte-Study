require('dotenv').config();
const path = require('path');
const fs = require('fs');
const db = require('./db');

// Auto-initialize database
console.log('Initializing database...');
const initDb = () => {
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `).run();
    console.log('✓ Database initialized successfully');
  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
  }
};

initDb();

// Start the server
require('./index.js');

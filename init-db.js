require('dotenv').config();
const db = require('../db');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');
console.log('Database initialized at', dbPath);
process.exit(0);

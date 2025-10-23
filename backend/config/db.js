const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const connectDB = async () => {
  try {
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
      } else {
        console.log('SQLite Connected successfully');
        initTables();
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const initTables = () => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE,
      country TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      balance REAL DEFAULT 0.00,
      profit REAL DEFAULT 0.00,
      withdrawals_pending REAL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create deposits table
  db.run(`
    CREATE TABLE IF NOT EXISTS deposits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      transaction_hash TEXT,
      admin_note TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create withdrawals table
  db.run(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      admin_note TEXT DEFAULT '',
      method TEXT DEFAULT 'bank',
      bank_details TEXT,
      crypto_details TEXT,
      paypal_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create audit_logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      target_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
      note TEXT DEFAULT '',
      amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create wallet_addresses table
  db.run(`
    CREATE TABLE IF NOT EXISTS wallet_addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency TEXT UNIQUE NOT NULL,
      network TEXT NOT NULL,
      address TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
};

module.exports = { connectDB, getDB };

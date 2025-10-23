const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0.00,
        profit DECIMAL(15,2) DEFAULT 0.00,
        withdrawals_pending DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createUsersTable);
    console.log('✅ Users table created successfully');

    // Create deposits table
    const createDepositsTable = `
      CREATE TABLE IF NOT EXISTS deposits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        wallet_address VARCHAR(255),
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createDepositsTable);
    console.log('✅ Deposits table created successfully');

    // Create withdrawals table
    const createWithdrawalsTable = `
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        wallet_address VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createWithdrawalsTable);
    console.log('✅ Withdrawals table created successfully');

    // Create transactions table
    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createTransactionsTable);
    console.log('✅ Transactions table created successfully');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initDatabase();

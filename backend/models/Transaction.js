const { getDB } = require('../config/db');

class Transaction {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.type = data.type;
    this.amount = data.amount;
    this.description = data.description;
    this.status = data.status || 'pending';
    this.createdAt = data.created_at;
  }

  static async create(transactionData) {
    const db = getDB();
    const { userId, type, amount, description, status } = transactionData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO transactions (user_id, type, amount, description, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const values = [userId, type, amount, description || '', status || 'pending'];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created transaction
          db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new Transaction(row));
            }
          });
        }
      });
    });
  }

  static async findByUserId(userId, limit = 50) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      
      db.all(query, [userId, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new Transaction(row)));
        }
      });
    });
  }

  static async findById(id) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new Transaction(row));
        }
      });
    });
  }

  async save() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE transactions 
        SET type = ?, amount = ?, description = ?, status = ?
        WHERE id = ?
      `;
      
      const values = [this.type, this.amount, this.description, this.status, this.id];
      
      db.run(query, values, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Transaction;
const { getDB } = require('../config/db');

class Deposit {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.status = data.status;
    this.transactionHash = data.transaction_hash;
    this.adminNote = data.admin_note;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(depositData) {
    const db = getDB();
    const { userId, amount, currency, status, transactionHash, adminNote } = depositData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO deposits (user_id, amount, currency, status, transaction_hash, admin_note)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const values = [userId, amount, currency, status || 'pending', transactionHash || '', adminNote || ''];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created deposit
          db.get('SELECT * FROM deposits WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new Deposit(row));
            }
          });
        }
      });
    });
  }

  static async findByUserId(userId) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM deposits 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new Deposit(row)));
        }
      });
    });
  }

  static async findById(id) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM deposits WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new Deposit(row));
        }
      });
    });
  }

  async save() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE deposits 
        SET amount = ?, currency = ?, status = ?, transaction_hash = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const values = [this.amount, this.currency, this.status, this.transactionHash, this.adminNote, this.id];
      
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

module.exports = Deposit;

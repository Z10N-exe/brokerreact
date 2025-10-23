const { getDB } = require('../config/db');

class Withdrawal {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.amount = data.amount;
    this.status = data.status;
    this.adminNote = data.admin_note;
    this.method = data.method;
    this.bankDetails = data.bank_details ? JSON.parse(data.bank_details) : null;
    this.cryptoDetails = data.crypto_details ? JSON.parse(data.crypto_details) : null;
    this.paypalDetails = data.paypal_details ? JSON.parse(data.paypal_details) : null;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(withdrawalData) {
    const db = getDB();
    const { userId, amount, status, adminNote, method, bankDetails, cryptoDetails, paypalDetails } = withdrawalData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO withdrawals (user_id, amount, status, admin_note, method, bank_details, crypto_details, paypal_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        userId, 
        amount, 
        status || 'pending', 
        adminNote || '', 
        method || 'bank',
        bankDetails ? JSON.stringify(bankDetails) : null,
        cryptoDetails ? JSON.stringify(cryptoDetails) : null,
        paypalDetails ? JSON.stringify(paypalDetails) : null
      ];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created withdrawal
          db.get('SELECT * FROM withdrawals WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new Withdrawal(row));
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
        SELECT * FROM withdrawals 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new Withdrawal(row)));
        }
      });
    });
  }

  static async findById(id) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM withdrawals WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new Withdrawal(row));
        }
      });
    });
  }

  async save() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE withdrawals 
        SET amount = ?, status = ?, admin_note = ?, method = ?, bank_details = ?, crypto_details = ?, paypal_details = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const values = [
        this.amount, 
        this.status, 
        this.adminNote, 
        this.method,
        this.bankDetails ? JSON.stringify(this.bankDetails) : null,
        this.cryptoDetails ? JSON.stringify(this.cryptoDetails) : null,
        this.paypalDetails ? JSON.stringify(this.paypalDetails) : null,
        this.id
      ];
      
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

module.exports = Withdrawal;

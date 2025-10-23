const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');

class User {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.email = data.email;
    this.country = data.country;
    this.phone = data.phone;
    this.passwordHash = data.password_hash;
    this.balance = data.balance || 0;
    this.profit = data.profit || 0;
    this.withdrawalsPending = data.withdrawals_pending || 0;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(userData) {
    const db = getDB();
    const { firstName, lastName, email, country, phone, passwordHash } = userData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (first_name, last_name, email, country, phone, password_hash, balance, profit, withdrawals_pending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [firstName, lastName, email, country, phone, passwordHash, 0, 0, 0];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created user
          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new User(row));
            }
          });
        }
      });
    });
  }

  static async findByPhone(phone) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new User(row));
        }
      });
    });
  }

  static async findByEmail(email) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new User(row));
        }
      });
    });
  }

  static async findById(id) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new User(row));
        }
      });
    });
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  }

  async save() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, country = ?, phone = ?, 
            balance = ?, profit = ?, withdrawals_pending = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const values = [
        this.firstName, this.lastName, this.email, this.country, this.phone,
        this.balance, this.profit, this.withdrawalsPending, this.id
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

module.exports = User;

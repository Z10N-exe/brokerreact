const { getDB } = require('../config/db');

class WalletAddress {
  constructor(data) {
    this.id = data.id;
    this.currency = data.currency;
    this.network = data.network;
    this.address = data.address;
    this.updatedBy = data.updated_by;
    this.updatedAt = data.updated_at;
  }

  static async create(walletData) {
    const db = getDB();
    const { currency, network, address, updatedBy } = walletData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO wallet_addresses (currency, network, address, updated_by)
        VALUES (?, ?, ?, ?)
      `;
      
      const values = [currency, network, address, updatedBy];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created wallet address
          db.get('SELECT * FROM wallet_addresses WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new WalletAddress(row));
            }
          });
        }
      });
    });
  }

  static async findByCurrency(currency) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM wallet_addresses WHERE currency = ?', [currency], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new WalletAddress(row));
        }
      });
    });
  }

  static async findAll() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM wallet_addresses ORDER BY currency', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new WalletAddress(row)));
        }
      });
    });
  }

  async save() {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE wallet_addresses 
        SET currency = ?, network = ?, address = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const values = [this.currency, this.network, this.address, this.updatedBy, this.id];
      
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

module.exports = WalletAddress;

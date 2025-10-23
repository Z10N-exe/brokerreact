const { getDB } = require('../config/db');

class AuditLog {
  constructor(data) {
    this.id = data.id;
    this.action = data.action;
    this.adminName = data.admin_name;
    this.targetUser = data.target_user;
    this.note = data.note;
    this.amount = data.amount;
    this.createdAt = data.created_at;
  }

  static async create(auditData) {
    const db = getDB();
    const { action, adminName, targetUser, note, amount } = auditData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO audit_logs (action, admin_name, target_user, note, amount)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const values = [action, adminName, targetUser, note || '', amount || 0];
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created audit log
          db.get('SELECT * FROM audit_logs WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(new AuditLog(row));
            }
          });
        }
      });
    });
  }

  static async findByTargetUser(userId) {
    const db = getDB();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM audit_logs 
        WHERE target_user = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => new AuditLog(row)));
        }
      });
    });
  }
}

module.exports = AuditLog;

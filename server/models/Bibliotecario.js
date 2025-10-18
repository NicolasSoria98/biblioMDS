const db = require('../config/db');

class Bibliotecario {
  static async getAll() {
    const [rows] = await db.query('SELECT id, nombre, email FROM bibliotecario');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT id, nombre, email FROM bibliotecario WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByEmail(email) {
    const [rows] = await db.query('SELECT * FROM bibliotecario WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(data) {
    const { nombre, email, contrasena } = data;
    const [result] = await db.query(
      'INSERT INTO bibliotecario (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, contrasena]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, email } = data;
    const [result] = await db.query(
      'UPDATE bibliotecario SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM bibliotecario WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Bibliotecario;
const db = require('../config/db');

class Socio {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM socio ORDER BY id');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM socio WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByDni(dni) {
    const [rows] = await db.query('SELECT * FROM socio WHERE dni = ?', [dni]);
    return rows[0];
  }

  static async create(data) {
    const { nombre, dni, email } = data;
    const [result] = await db.query(
      'INSERT INTO socio (nombre, dni, email) VALUES (?, ?, ?)',
      [nombre, dni, email]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nombre, dni, email } = data;
    const [result] = await db.query(
      'UPDATE socio SET nombre = ?, dni = ?, email = ? WHERE id = ?',
      [nombre, dni, email, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM socio WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getPrestamosActivos(idSocio) {
    const [rows] = await db.query(
      `SELECT p.*, l.titulo, l.autor 
       FROM prestamo p
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       WHERE p.id_socio = ? AND p.estado = 'activo'`,
      [idSocio]
    );
    return rows;
  }

  static async getMultasPendientes(idSocio) {
    const [rows] = await db.query(
      'SELECT * FROM multa WHERE id_socio = ? AND estado = "pendiente"',
      [idSocio]
    );
    return rows;
  }
}

module.exports = Socio;
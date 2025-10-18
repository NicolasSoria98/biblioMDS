const db = require('../config/db');

class Ejemplar {
  static async getAll() {
    const [rows] = await db.query(
      `SELECT e.*, l.titulo, l.autor, l.isbn 
       FROM ejemplar e
       JOIN libro l ON e.id_libro = l.id
       ORDER BY e.id`
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      `SELECT e.*, l.titulo, l.autor, l.isbn 
       FROM ejemplar e
       JOIN libro l ON e.id_libro = l.id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getByLibro(idLibro) {
    const [rows] = await db.query('SELECT * FROM ejemplar WHERE id_libro = ?', [idLibro]);
    return rows;
  }

  static async getDisponibles() {
    const [rows] = await db.query(
      `SELECT e.*, l.titulo, l.autor, l.isbn 
       FROM ejemplar e
       JOIN libro l ON e.id_libro = l.id
       WHERE e.estado = 'disponible'
       ORDER BY l.titulo`
    );
    return rows;
  }

  static async create(data) {
    const { id_libro, observaciones } = data;
    const [result] = await db.query(
      'INSERT INTO ejemplar (id_libro, observaciones) VALUES (?, ?)',
      [id_libro, observaciones || null]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { estado, observaciones } = data;
    const [result] = await db.query(
      'UPDATE ejemplar SET estado = ?, observaciones = ? WHERE id = ?',
      [estado, observaciones, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM ejemplar WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async cambiarEstado(id, nuevoEstado) {
    const [result] = await db.query(
      'UPDATE ejemplar SET estado = ? WHERE id = ?',
      [nuevoEstado, id]
    );
    return result.affectedRows;
  }
}

module.exports = Ejemplar;
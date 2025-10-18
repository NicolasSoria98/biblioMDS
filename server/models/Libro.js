const db = require('../config/db');

class Libro {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM libro ORDER BY titulo');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM libro WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByIsbn(isbn) {
    const [rows] = await db.query('SELECT * FROM libro WHERE isbn = ?', [isbn]);
    return rows[0];
  }

  static async create(data) {
    const { titulo, autor, isbn, anio_publicacion, descripcion } = data;
    const [result] = await db.query(
      'INSERT INTO libro (titulo, autor, isbn, anio_publicacion, descripcion) VALUES (?, ?, ?, ?, ?)',
      [titulo, autor, isbn, anio_publicacion, descripcion]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { titulo, autor, isbn, anio_publicacion, descripcion } = data;
    const [result] = await db.query(
      'UPDATE libro SET titulo = ?, autor = ?, isbn = ?, anio_publicacion = ?, descripcion = ? WHERE id = ?',
      [titulo, autor, isbn, anio_publicacion, descripcion, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM libro WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getEjemplares(idLibro) {
    const [rows] = await db.query('SELECT * FROM ejemplar WHERE id_libro = ?', [idLibro]);
    return rows;
  }

  static async getDisponibilidad(idLibro) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN estado = 'prestado' THEN 1 ELSE 0 END) as prestados,
        SUM(CASE WHEN estado = 'en_reparacion' THEN 1 ELSE 0 END) as en_reparacion
       FROM ejemplar WHERE id_libro = ?`,
      [idLibro]
    );
    return rows[0];
  }
}

module.exports = Libro;
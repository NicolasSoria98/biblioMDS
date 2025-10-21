const db = require('../config/db');

class Multa {
  static _baseQuery() {
    return `
      SELECT m.*, s.nombre as nombre_socio, s.dni
      FROM multa m
      JOIN socio s ON m.id_socio = s.id
    `;
  }

  static async getAll() {
    const query = `${this._baseQuery()} ORDER BY m.fecha_multa DESC`;
    const [rows] = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `${this._baseQuery()} WHERE m.id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  static async getPendientes() {
    const query = `${this._baseQuery()} WHERE m.estado = 'pendiente' ORDER BY m.fecha_multa DESC`;
    const [rows] = await db.query(query);
    return rows;
  }

  static async getPorSocio(idSocio) {
    const query = `${this._baseQuery()} WHERE m.id_socio = ? ORDER BY m.fecha_multa DESC`;
    const [rows] = await db.query(query, [idSocio]);
    return rows;
  }

  static async create(data) {
    const { id_socio, id_prestamo, monto, motivo } = data;
    const [result] = await db.query(
      'INSERT INTO multa (id_socio, id_prestamo, monto, motivo) VALUES (?, ?, ?, ?)',
      [id_socio, id_prestamo || null, monto, motivo]
    );
    return result.insertId;
  }

  static async registrarPago(id, fecha_pago) {
    const [result] = await db.query(
      'UPDATE multa SET estado = "pagada", fecha_pago = ? WHERE id = ?',
      [fecha_pago, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM multa WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getTotalPorSocio(idSocio) {
    const [rows] = await db.query(
      `SELECT SUM(monto) as total 
       FROM multa 
       WHERE id_socio = ? AND estado = 'pendiente'`,
      [idSocio]
    );
    return rows[0].total || 0;
  }
}

module.exports = Multa;
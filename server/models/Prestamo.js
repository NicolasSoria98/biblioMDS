const db = require('../config/db');

class Prestamo {
  static async getAll() {
    const [rows] = await db.query(
      `SELECT p.*, 
        s.nombre as nombre_socio, s.dni,
        l.titulo, l.autor,
        b.nombre as nombre_bibliotecario
       FROM prestamo p
       JOIN socio s ON p.id_socio = s.id
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       JOIN bibliotecario b ON p.id_bibliotecario = b.id
       ORDER BY p.fecha_prestamo DESC`
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      `SELECT p.*, 
        s.nombre as nombre_socio, s.dni,
        l.titulo, l.autor,
        b.nombre as nombre_bibliotecario,
        e.id_libro
       FROM prestamo p
       JOIN socio s ON p.id_socio = s.id
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       JOIN bibliotecario b ON p.id_bibliotecario = b.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getActivos() {
    const [rows] = await db.query(
      `SELECT p.*, 
        s.nombre as nombre_socio, s.dni,
        l.titulo, l.autor,
        b.nombre as nombre_bibliotecario,
        DATEDIFF(CURRENT_DATE, p.fecha_devolucion_estimada) as dias_retraso
       FROM prestamo p
       JOIN socio s ON p.id_socio = s.id
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       JOIN bibliotecario b ON p.id_bibliotecario = b.id
       WHERE p.estado = 'activo'
       ORDER BY p.fecha_devolucion_estimada`
    );
    return rows;
  }

  static async getVencidos() {
    const [rows] = await db.query(
      `SELECT p.*, 
        s.nombre as nombre_socio, s.dni,
        l.titulo, l.autor,
        DATEDIFF(CURRENT_DATE, p.fecha_devolucion_estimada) as dias_retraso
       FROM prestamo p
       JOIN socio s ON p.id_socio = s.id
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       WHERE p.estado = 'vencido'
       ORDER BY p.fecha_devolucion_estimada`
    );
    return rows;
  }

  static async create(data) {
    const { id_ejemplar, id_socio, id_bibliotecario, fecha_devolucion_estimada } = data;
    const [result] = await db.query(
      'INSERT INTO prestamo (id_ejemplar, id_socio, id_bibliotecario, fecha_devolucion_estimada) VALUES (?, ?, ?, ?)',
      [id_ejemplar, id_socio, id_bibliotecario, fecha_devolucion_estimada]
    );
    return result.insertId;
  }

  static async registrarDevolucion(id, fecha_devolucion_real) {
    const [result] = await db.query(
      'UPDATE prestamo SET fecha_devolucion_real = ?, estado = "devuelto" WHERE id = ?',
      [fecha_devolucion_real, id]
    );
    return result.affectedRows;
  }

  static async marcarVencido(id) {
    const [result] = await db.query(
      'UPDATE prestamo SET estado = "vencido" WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async getPorSocio(idSocio) {
    const [rows] = await db.query(
      `SELECT p.*, l.titulo, l.autor
       FROM prestamo p
       JOIN ejemplar e ON p.id_ejemplar = e.id
       JOIN libro l ON e.id_libro = l.id
       WHERE p.id_socio = ?
       ORDER BY p.fecha_prestamo DESC`,
      [idSocio]
    );
    return rows;
  }
}

module.exports = Prestamo;
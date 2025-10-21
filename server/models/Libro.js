const db = require('../config/db');

/**
 * Modelo para gestionar los libros en la base de datos
 * @class Libro
 */
class Libro {
  /**
   * Obtiene todos los libros ordenados por título
   * @returns {Promise<Array>} Array de objetos libro
   * @example
   * const libros = await Libro.getAll();
   * // [{ id: 1, titulo: "...", autor: "...", ... }, ...]
   */
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM libro ORDER BY titulo');
    return rows;
  }

  /**
   * Obtiene un libro por su ID
   * @param {number} id - ID del libro
   * @returns {Promise<Object|undefined>} Objeto libro o undefined si no existe
   * @example
   * const libro = await Libro.getById(5);
   * // { id: 5, titulo: "1984", autor: "George Orwell", ... }
   */
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM libro WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Busca un libro por su ISBN
   * @param {string} isbn - ISBN del libro (único)
   * @returns {Promise<Object|undefined>} Objeto libro o undefined si no existe
   * @example
   * const libro = await Libro.getByIsbn('978-3-16-148410-0');
   */
  static async getByIsbn(isbn) {
    const [rows] = await db.query('SELECT * FROM libro WHERE isbn = ?', [isbn]);
    return rows[0];
  }

  /**
   * Crea un nuevo libro en la base de datos
   * @param {Object} data - Datos del libro
   * @param {string} data.titulo - Título del libro
   * @param {string} data.autor - Autor del libro
   * @param {string} data.isbn - ISBN del libro
   * @param {number} data.anio_publicacion - Año de publicación
   * @param {string} [data.descripcion] - Descripción del libro (opcional)
   * @returns {Promise<number>} ID del libro creado
   * @throws {Error} Si el ISBN ya existe o faltan datos requeridos
   * @example
   * const id = await Libro.create({
   *   titulo: "El Principito",
   *   autor: "Antoine de Saint-Exupéry",
   *   isbn: "978-0-15-601219-0",
   *   anio_publicacion: 1943,
   *   descripcion: "Una novela corta..."
   * });
   * // 15
   */
  static async create(data) {
    const { titulo, autor, isbn, anio_publicacion, descripcion } = data;
    const [result] = await db.query(
      'INSERT INTO libro (titulo, autor, isbn, anio_publicacion, descripcion) VALUES (?, ?, ?, ?, ?)',
      [titulo, autor, isbn, anio_publicacion, descripcion]
    );
    return result.insertId;
  }

  /**
   * Actualiza los datos de un libro existente
   * @param {number} id - ID del libro a actualizar
   * @param {Object} data - Datos a actualizar
   * @param {string} data.titulo - Nuevo título
   * @param {string} data.autor - Nuevo autor
   * @param {string} data.isbn - Nuevo ISBN
   * @param {number} data.anio_publicacion - Nuevo año
   * @param {string} [data.descripcion] - Nueva descripción
   * @returns {Promise<number>} Número de filas afectadas (0 o 1)
   * @example
   * const updated = await Libro.update(5, {
   *   titulo: "1984 (Edición Especial)",
   *   autor: "George Orwell",
   *   isbn: "978-0-452-28423-4",
   *   anio_publicacion: 1949,
   *   descripcion: "Edición con prólogo..."
   * });
   * // 1
   */
  static async update(id, data) {
    const { titulo, autor, isbn, anio_publicacion, descripcion } = data;
    const [result] = await db.query(
      'UPDATE libro SET titulo = ?, autor = ?, isbn = ?, anio_publicacion = ?, descripcion = ? WHERE id = ?',
      [titulo, autor, isbn, anio_publicacion, descripcion, id]
    );
    return result.affectedRows;
  }

  /**
   * Elimina un libro de la base de datos
   * @param {number} id - ID del libro a eliminar
   * @returns {Promise<number>} Número de filas afectadas (0 o 1)
   * @warning Esto también eliminará todos los ejemplares asociados si hay CASCADE
   * @example
   * const deleted = await Libro.delete(5);
   * // 1
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM libro WHERE id = ?', [id]);
    return result.affectedRows;
  }

  /**
   * Obtiene todos los ejemplares físicos de un libro
   * @param {number} idLibro - ID del libro
   * @returns {Promise<Array>} Array de objetos ejemplar
   * @example
   * const ejemplares = await Libro.getEjemplares(5);
   * // [
   * //   { id: 10, id_libro: 5, estado: 'disponible', ... },
   * //   { id: 11, id_libro: 5, estado: 'prestado', ... }
   * // ]
   */
  static async getEjemplares(idLibro) {
    const [rows] = await db.query('SELECT * FROM ejemplar WHERE id_libro = ?', [idLibro]);
    return rows;
  }

  /**
   * Obtiene estadísticas de disponibilidad de ejemplares de un libro
   * @param {number} idLibro - ID del libro
   * @returns {Promise<Object>} Objeto con contadores de disponibilidad
   * @returns {number} return.total - Total de ejemplares
   * @returns {number} return.disponibles - Ejemplares disponibles
   * @returns {number} return.prestados - Ejemplares prestados
   * @returns {number} return.en_reparacion - Ejemplares en reparación
   * @example
   * const disponibilidad = await Libro.getDisponibilidad(5);
   * // {
   * //   total: 5,
   * //   disponibles: 3,
   * //   prestados: 1,
   * //   en_reparacion: 1
   * // }
   */
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
/**
 * Observable para gestionar el estado de multas impagas en toda la aplicación
 * Implementa el patrón Observer para notificar cambios a múltiples componentes
 * @class MultasObservable
 * @example
 * import multasObservable from './services/MultasObservable';
 * 
 * // Suscribirse a cambios
 * const unsubscribe = multasObservable.subscribe((data) => {
 *   console.log('Evento:', data.type, 'Contador:', data.count);
 * });
 * 
 * // Desuscribirse
 * unsubscribe();
 */
class MultasObservable {
  /**
   * Inicializa el observable con arrays vacíos de observadores
   * @constructor
   */
  constructor() {
    /**
     * Lista de funciones callback suscritas
     * @type {Array<Function>}
     * @private
     */
    this.observers = [];
    
    /**
     * Contador actual de multas impagas
     * @type {number}
     * @private
     */
    this.multasImpagasCount = 0;
  }

  /**
   * Suscribe un observador para recibir notificaciones de cambios
   * @param {Function} callback - Función que se ejecutará cuando haya cambios
   * @param {Object} callback.data - Datos del evento
   * @param {string} callback.data.type - Tipo de evento ('MULTAS_COUNT_UPDATED', 'MULTA_PAGADA', 'MULTA_CREADA')
   * @param {number} callback.data.count - Contador actual de multas impagas
   * @returns {Function} Función para desuscribirse
   * @example
   * const unsubscribe = multasObservable.subscribe((data) => {
   *   if (data.type === 'MULTA_PAGADA') {
   *     console.log('Multa pagada! Quedan:', data.count);
   *   }
   * });
   * 
   * // Más tarde, cuando el componente se desmonte
   * unsubscribe();
   */
  subscribe(callback) {
    this.observers.push(callback);
    
    // Retorna función de limpieza para desuscribirse
    return () => {
      this.observers = this.observers.filter(obs => obs !== callback);
    };
  }

  /**
   * Notifica a todos los observadores suscritos sobre un cambio
   * @param {Object} data - Datos del evento a notificar
   * @param {string} data.type - Tipo de evento
   * @param {number} data.count - Contador actualizado
   * @private
   * @example
   * this.notify({ type: 'MULTA_PAGADA', count: 5 });
   */
  notify(data) {
    this.observers.forEach(callback => {
      callback(data);
    });
  }

  /**
   * Establece el contador de multas impagas y notifica a los observadores
   * @param {number} count - Nuevo valor del contador
   * @fires MultasObservable#MULTAS_COUNT_UPDATED
   * @example
   * // Después de cargar multas desde la API
   * const multasPendientes = multas.filter(m => m.estado === 'pendiente').length;
   * multasObservable.setMultasImpagasCount(multasPendientes);
   */
  setMultasImpagasCount(count) {
    this.multasImpagasCount = count;
    this.notify({ 
      type: 'MULTAS_COUNT_UPDATED', 
      count: this.multasImpagasCount 
    });
  }

  /**
   * Decrementa el contador de multas impagas en 1 y notifica
   * Solo decrementa si el contador es mayor a 0
   * @fires MultasObservable#MULTA_PAGADA
   * @example
   * // Cuando un usuario paga una multa
   * await api.registrarPagoMulta(multaId, fechaPago);
   * multasObservable.decrementMultasImpagas();
   */
  decrementMultasImpagas() {
    if (this.multasImpagasCount > 0) {
      this.multasImpagasCount--;
      this.notify({ 
        type: 'MULTA_PAGADA', 
        count: this.multasImpagasCount 
      });
    }
  }

  /**
   * Incrementa el contador de multas impagas en 1 y notifica
   * @fires MultasObservable#MULTA_CREADA
   * @example
   * // Cuando se crea una nueva multa
   * await api.crearMulta(multaData);
   * multasObservable.incrementMultasImpagas();
   */
  incrementMultasImpagas() {
    this.multasImpagasCount++;
    this.notify({ 
      type: 'MULTA_CREADA', 
      count: this.multasImpagasCount 
    });
  }

  /**
   * Obtiene el contador actual de multas impagas
   * @returns {number} Número de multas impagas
   * @example
   * const count = multasObservable.getMultasImpagasCount();
   * console.log(`Tienes ${count} multas pendientes`);
   */
  getMultasImpagasCount() {
    return this.multasImpagasCount;
  }
}

/**
 * Instancia única (Singleton) del observable de multas
 * @type {MultasObservable}
 * @example
 * import multasObservable from './services/MultasObservable';
 * 
 * // Usar en cualquier parte de la aplicación
 * multasObservable.subscribe((data) => {
 *   console.log('Cambio detectado:', data);
 * });
 */
export default new MultasObservable();

/**
 * Evento emitido cuando se actualiza el contador completo
 * @event MultasObservable#MULTAS_COUNT_UPDATED
 * @type {Object}
 * @property {string} type - 'MULTAS_COUNT_UPDATED'
 * @property {number} count - Nuevo contador de multas
 */

/**
 * Evento emitido cuando se paga una multa
 * @event MultasObservable#MULTA_PAGADA
 * @type {Object}
 * @property {string} type - 'MULTA_PAGADA'
 * @property {number} count - Contador actualizado después del pago
 */

/**
 * Evento emitido cuando se crea una nueva multa
 * @event MultasObservable#MULTA_CREADA
 * @type {Object}
 * @property {string} type - 'MULTA_CREADA'
 * @property {number} count - Contador actualizado después de la creación
 */
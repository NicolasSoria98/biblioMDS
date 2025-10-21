class ApiFacade {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en la petición');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  obtenerPrestamosActivos() {
    return this.request('/prestamos/activos');
  }
  
  obtenerPrestamosVencidos() {
    return this.request('/prestamos/vencidos');
  }

  crearPrestamo(data) {
    return this.request('/prestamos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  registrarDevolucion(id, fecha) {
    return this.request(`/prestamos/${id}/devolucion`, {
      method: 'PUT',
      body: JSON.stringify({ fecha_devolucion_real: fecha })
    });
  }

  obtenerLibros() {
    return this.request('/libros');
  }

  obtenerLibro(id) {
    return this.request(`/libros/${id}`);
  }

  crearLibro(data) {
    return this.request('/libros', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  actualizarLibro(id, data) {
    return this.request(`/libros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  eliminarLibro(id) {
    return this.request(`/libros/${id}`, { method: 'DELETE' });
  }
  obtenerSocios() {
    return this.request('/socios');
  }

  crearSocio(data) {
    return this.request('/socios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  actualizarSocio(id, data) {
    return this.request(`/socios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  eliminarSocio(id) {
    return this.request(`/socios/${id}`, { method: 'DELETE' });
  }
  obtenerMultas() {
    return this.request('/multas');
  }

  obtenerMultasImpagas() {
    return this.request('/multas?estado=pendiente');
  }

  registrarPagoMulta(id, fechaPago) {
    return this.request(`/multas/${id}/pago`, {
      method: 'PUT',
      body: JSON.stringify({ fecha_pago: fechaPago })
    });
  }
}

class DateFacade {
  formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-AR');
  }

  formatDateTime(date) {
    if (!date) return '';
    return new Date(date).toLocaleString('es-AR');
  }

  calculateDaysFromNow(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(date) {
    return this.calculateDaysFromNow(date) < 0;
  }

  formatForInput(date) {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
}

class FilterFacade {
  filterByMultipleFields(items, filters) {
    let filtered = [...items];

    Object.entries(filters).forEach(([field, value]) => {
      if (value && value.trim() !== '') {
        const search = value.toLowerCase().trim();
        filtered = filtered.filter(item => 
          item[field]?.toString().toLowerCase().includes(search)
        );
      }
    });

    return filtered;
  }

  sortBy(items, field, order = 'asc') {
    return [...items].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

class NotificationFacade {
  success(msg) { console.log('exito', msg); }
  error(msg) { console.error('error', msg); }
  warning(msg) { console.warn('advertencia', msg); }
  info(msg) { console.info('info', msg); }
  confirm(msg) { return window.confirm(msg); }
}


export const api = new ApiFacade();
export const date = new DateFacade();
export const filter = new FilterFacade();
export const notification = new NotificationFacade();
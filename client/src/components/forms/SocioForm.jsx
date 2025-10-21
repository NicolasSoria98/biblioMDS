function SocioForm({ 
  formData, 
  onSubmit, 
  onChange, 
  onCancel, 
  loading, 
  error 
}) {
  return (
    <form className="modal-form" onSubmit={onSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="nombre" className="form-label required">
          Nombre Completo
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="form-input"
          value={formData.nombre}
          onChange={onChange}
          placeholder="Ej: Juan Pérez"
          required
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dni" className="form-label required">
            DNI
          </label>
          <input
            type="number"
            id="dni"
            name="dni"
            className="form-input"
            value={formData.dni}
            onChange={onChange}
            placeholder="Ej: 35123456"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={onChange}
            placeholder="ejemplo@email.com"
            disabled={loading}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </div>
    </form>
  );
}

export default SocioForm;
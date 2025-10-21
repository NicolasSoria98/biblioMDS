import { useState } from 'react';
import axios from 'axios';
import SocioForm from './SocioForm';

function RegistrarSocioForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/socios', formData);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el socio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocioForm
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={onCancel}
      loading={loading}
      error={error}
    />
  );
}

export default RegistrarSocioForm;
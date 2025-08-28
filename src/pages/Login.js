import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { authApi } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, authApi.login);
      navigate('/tecnicos');
    } catch (err) {
      alert('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Sistema de Gestión</h1>
          <p className="login-subtitle">Tickets de Asistencia Técnica</p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Ingrese su email"
            />
          </div>
          
          <div className="form-group">
            <label>Clave</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Ingrese su contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{width: '100%'}}
          >
            {loading ? (
              <div className="login-spinner">
                <div className="login-spinner-icon"></div>
                Ingresando...
              </div>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

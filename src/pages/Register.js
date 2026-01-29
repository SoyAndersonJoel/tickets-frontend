import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validaciones básicas antes de llamar a Firebase
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo válido.');
        setLoading(false);
        return;
      }
      if (!password || password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }

      const res = await authApi.register(email, password);
      if (res && res.emailSent === false) {
        // Registro creado pero fallo el envío de correo
        alert('Registro exitoso, pero no pudimos enviar el correo de verificación: ' + (res.emailError || 'intenta más tarde.'));
        navigate('/login');
      } else {
        alert('Registro exitoso. Enviamos un correo de confirmación. Por favor verifica tu email antes de iniciar sesión.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Register error:', err);
      // Manejo específico de errores de Firebase
      if (err && err.code === 'auth/email-already-in-use') {
        alert('El correo ya está registrado. Por favor inicia sesión o usa otro correo.');
      } else if (err && err.code === 'auth/invalid-email') {
        alert('El correo ingresado no es válido.');
      } else if (err && err.code === 'auth/weak-password') {
        alert('La contraseña es muy débil. Usa al menos 6 caracteres.');
      } else {
        alert('Error registrando usuario: ' + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Crear cuenta</h1>
          <p className="login-subtitle">Regístrate para acceder al sistema de tickets</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@empresa.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !email || !password} style={{width: '100%'}}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

          <div style={{marginTop: '1rem', textAlign: 'center'}}>
            <small>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></small>
          </div>

        </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/tecnicos" className="nav-link">
            👨‍🔧 Técnicos
          </Link>
          <Link to="/clientes" className="nav-link">
            👥 Clientes
          </Link>
          <Link to="/tickets" className="nav-link">
            🎫 Tickets
          </Link>
        </div>
        <div className="navbar-right">
          <span className="welcome-text">
            Bienvenido - <span className="welcome-name">{user?.nombre || user?.name || user?.email}</span>
          </span>
          <button onClick={onLogout} className="btn btn-danger btn-small">
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

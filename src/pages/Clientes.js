import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { clientesApi } from '../services/api';

const empty = {
  cedula: '', nombre: '', apellido: '', ciudad: '', email: '', direccion: '', telefono: '', fecha_nacimiento: '', dependencia: ''
};

export default function Clientes() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setItems(await clientesApi.list()); } finally { setLoading(false); }
  };
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    load();
  }, [authLoading, user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await clientesApi.update(editingId, form);
      } else {
        await clientesApi.create(form);
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar el cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (it) => { 
    setEditingId(it.id); 
    setForm({
      cedula: it.cedula || '',
      nombre: it.nombre || '',
      apellido: it.apellido || '',
      ciudad: it.ciudad || '',
      email: it.email || '',
      direccion: it.direccion || '',
      telefono: it.telefono || '',
      fecha_nacimiento: it.fecha_nacimiento || '',
      dependencia: it.dependencia || ''
    }); 
  };
  const onDelete = async (id) => { if (!window.confirm('¿Eliminar cliente?')) return; await clientesApi.remove(id); await load(); };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">
            Bienvenido - {user?.nombre || user?.name || user?.email}
          </h2>
          <h3 className="page-subtitle">Gestión de Clientes</h3>
        </div>

        {/* Formulario */}
        <div className="card">
          <h4 className="section-title">
            {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h4>
          <form onSubmit={onSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Cédula</label>
                <input name="cedula" value={form.cedula} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input name="apellido" value={form.apellido} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input name="ciudad" value={form.ciudad} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" value={form.email} onChange={onChange} required type="email" />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Fecha Nacimiento</label>
                <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={onChange} required type="date" />
              </div>
              <div className="form-group">
                <label>Dependencia</label>
                <input name="dependencia" value={form.dependencia} onChange={onChange} />
              </div>
            </div>
            
            <div className="flex flex-row">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <div className="login-spinner">
                    <div className="login-spinner-icon"></div>
                    {editingId ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : (
                  editingId ? 'Actualizar' : 'Crear'
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setForm(empty); }}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado */}
        <div className="card">
          <h4 className="section-title">Lista de Clientes</h4>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {['ID','Cédula','Nombre','Apellido','Ciudad','Email','Dirección','Teléfono','F. Nacimiento','Dependencia','Acciones'].map(h => 
                      <th key={h}>{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.cedula}</td>
                      <td>{it.nombre}</td>
                      <td>{it.apellido}</td>
                      <td>{it.ciudad}</td>
                      <td>{it.email}</td>
                      <td>{it.direccion}</td>
                      <td>{it.telefono}</td>
                      <td>{it.fecha_nacimiento}</td>
                      <td>{it.dependencia}</td>
                      <td>
                        <div className="flex flex-row">
                          <button onClick={() => onEdit(it)} className="btn btn-success btn-small">
                            Editar
                          </button>
                          <button onClick={() => onDelete(it.id)} className="btn btn-danger btn-small">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

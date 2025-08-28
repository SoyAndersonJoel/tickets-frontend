import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { tecnicosApi } from '../services/api';

const empty = {
  nombre: '', apellido: '', cedula: '', fecha_nacimiento: '', genero: '', ciudad: '', direccion: '', telefono: '', email: ''
};

export default function Tecnicos() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { 
      const data = await tecnicosApi.list();
      console.log('Técnicos cargados:', data);
      setItems(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await tecnicosApi.update(editingId, form);
      } else {
        await tecnicosApi.create(form);
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error('Error al guardar técnico:', error);
      alert('Error al guardar el técnico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (it) => {
    console.log('Editando técnico con ID:', it.id);
    console.log('Datos del técnico:', it);
    setEditingId(it.id);
    setForm({
      nombre: it.nombre || '',
      apellido: it.apellido || '',
      cedula: it.cedula || '',
      fecha_nacimiento: it.fecha_nacimiento || '',
      genero: it.genero || '',
      ciudad: it.ciudad || '',
      direccion: it.direccion || '',
      telefono: it.telefono || '',
      email: it.email || ''
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar técnico?')) return;
    await tecnicosApi.remove(id);
    await load();
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">
            Bienvenido - {user?.nombre || user?.name || user?.email}
          </h2>
          <h3 className="page-subtitle">Gestión de Técnicos</h3>
        </div>

        {/* Formulario */}
        <div className="card">
          <h4 className="section-title">
            {editingId ? 'Editar Técnico' : 'Nuevo Técnico'}
          </h4>
          <form onSubmit={onSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input name="apellido" value={form.apellido} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Cédula</label>
                <input name="cedula" value={form.cedula} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Fecha Nacimiento</label>
                <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={onChange} required type="date" />
              </div>
              <div className="form-group">
                <label>Género</label>
                <select name="genero" value={form.genero} onChange={onChange}>
                  <option value="">Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input name="ciudad" value={form.ciudad} onChange={onChange} required />
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
                <label>Email</label>
                <input name="email" value={form.email} onChange={onChange} required type="email" />
              </div>
            </div>
            
            <div className="flex flex-row">
              <button type="submit" className="btn btn-primary" disabled={loading}>
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
          <h4 className="section-title">Lista de Técnicos</h4>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {['ID','Nombre','Apellido','Cédula','F. Nacimiento','Género','Ciudad','Dirección','Teléfono','Email','Acciones'].map(h => 
                      <th key={h}>{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.nombre}</td>
                      <td>{it.apellido}</td>
                      <td>{it.cedula}</td>
                      <td>{it.fecha_nacimiento}</td>
                      <td>{it.genero}</td>
                      <td>{it.ciudad}</td>
                      <td>{it.direccion}</td>
                      <td>{it.telefono}</td>
                      <td>{it.email}</td>
                      <td>
                        <div className="flex flex-row">
                          <button onClick={() => onEdit(it)} className="btn btn-primary btn-small">
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

import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ticketsApi, clientesApi, tecnicosApi } from '../services/api';

const empty = { codigo: '', descripcion: '', id_tecnico: '', id_cliente: '' };

export default function Tickets() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [t, c, tec] = await Promise.all([
        ticketsApi.list(),
        clientesApi.list(),
        tecnicosApi.list()
      ]);
      setItems(t);
      setClientes(c);
      setTecnicos(tec);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Form data:', form);
      console.log('Editing ID:', editingId);
      
      if (editingId) {
        console.log('Updating ticket with ID:', editingId);
        const result = await ticketsApi.update(editingId, form);
        console.log('Update result:', result);
      } else {
        console.log('Creating new ticket');
        const result = await ticketsApi.create(form);
        console.log('Create result:', result);
      }
      
      setForm(empty); 
      setEditingId(null); 
      await load();
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      alert('Error al guardar el ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const onEdit = (it) => { 
    setEditingId(it.id); 
    setForm({ 
      codigo: it.codigo || '', 
      descripcion: it.descripcion || '', 
      id_tecnico: it.id_tecnico || '', 
      id_cliente: it.id_cliente || '' 
    }); 
  };
  const onDelete = async (id) => { if (!window.confirm('¿Eliminar ticket?')) return; await ticketsApi.remove(id); await load(); };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">
            Bienvenido - {user?.nombre || user?.name || user?.email}
          </h2>
          <h3 className="page-subtitle">Gestión de Tickets</h3>
        </div>

        {/* Formulario */}
        <div className="card">
          <h4 className="section-title">
            {editingId ? 'Editar Ticket' : 'Nuevo Ticket'}
          </h4>
          <form onSubmit={onSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Código</label>
                <input name="codigo" value={form.codigo} onChange={onChange} required />
              </div>
              <div className="form-group">
                {/* Campo vacío para mantener grid */}
              </div>
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={onChange} required rows="3" />
              </div>
              <div className="form-group">
                <label>Técnico Asignado</label>
                <select name="id_tecnico" value={form.id_tecnico} onChange={onChange} required>
                  <option value="">Seleccione técnico</option>
                  {tecnicos.map(t => 
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apellido}
                    </option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Cliente</label>
                <select name="id_cliente" value={form.id_cliente} onChange={onChange} required>
                  <option value="">Seleccione cliente</option>
                  {clientes.map(c => 
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex flex-row">
              <button type="submit" className="btn btn-purple" disabled={loading}>
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
          <h4 className="section-title">Lista de Tickets</h4>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {['ID','Código','Descripción','Técnico','Cliente','Acciones'].map(h => 
                      <th key={h}>{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const tecnico = tecnicos.find(t => t.id === it.id_tecnico);
                    const cliente = clientes.find(c => c.id === it.id_cliente);
                    return (
                      <tr key={it.id}>
                        <td>{it.id}</td>
                        <td>
                          <span className="badge badge-purple">
                            {it.codigo}
                          </span>
                        </td>
                        <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{it.descripcion}</td>
                        <td>{tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : it.id_tecnico}</td>
                        <td>{cliente ? `${cliente.nombre} ${cliente.apellido}` : it.id_cliente}</td>
                        <td>
                          <div className="flex flex-row">
                            <button onClick={() => onEdit(it)} className="btn btn-purple btn-small">
                              Editar
                            </button>
                            <button onClick={() => onDelete(it.id)} className="btn btn-danger btn-small">
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

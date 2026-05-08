'use client';

import React, { useEffect, useState } from 'react';
import { Sprout, Plus, Map, Activity, X, Edit2, Trash2 } from 'lucide-react';
import { getLotes, createLote, updateLote, deleteLote } from '@/lib/api';

export default function LotesPage() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newLote, setNewLote] = useState({
    nombre: '',
    cultivo: '',
    estado: 'activo',
    hectareas: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadLotes = async () => {
    try {
      const data = await getLotes();
      setLotes(data);
    } catch (error) {
      console.error("Error loading lotes", error);
      // Fallback demo data
      setLotes([
        { id: 1, nombre: 'Lote Norte', cultivo: 'Café Castillo', estado: 'Producción', hectareas: 4.5 },
        { id: 2, nombre: 'Lote Sur', cultivo: 'Café Colombia', estado: 'Mantenimiento', hectareas: 3.2 },
        { id: 3, nombre: 'La Colina', cultivo: 'Plátano Hartón', estado: 'Descanso', hectareas: 1.5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLote(editingId, newLote);
      } else {
        await createLote(newLote);
      }
      setShowForm(false);
      setNewLote({ nombre: '', cultivo: '', estado: 'activo', hectareas: 0 });
      setEditingId(null);
      loadLotes();
    } catch (error) {
      console.error("Error saving lote", error);
      alert("Error al guardar el lote. Verifica que el backend esté corriendo.");
    }
  };

  const handleEdit = (lote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewLote({ nombre: lote.nombre, cultivo: lote.cultivo || '', estado: lote.estado, hectareas: lote.hectareas });
    setEditingId(lote.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de que deseas eliminar este lote?")) {
      try {
        await deleteLote(id);
        loadLotes();
      } catch (error) {
        console.error("Error deleting", error);
        alert("No se pudo eliminar el lote.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Gestión de Lotes</h1>
          <p className="text-gray-500">Administra las divisiones y cultivos de La Leonora.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Lote
        </button>
      </header>

      {/* Modal / Overlay Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[var(--secondary)]">{editingId ? 'Actualizar Lote' : 'Nuevo Lote'}</h3>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setNewLote({ nombre: '', cultivo: '', estado: 'activo', hectareas: 0 });
                }} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nombre del Lote</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Lote El Mirador"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={newLote.nombre}
                  onChange={e => setNewLote({...newLote, nombre: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Cultivos</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Café Bourbon, Aguacate Hass, Plátano"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={newLote.cultivo}
                  onChange={e => setNewLote({...newLote, cultivo: e.target.value})}
                />
                <p className="text-xs text-gray-500">Ingresa los cultivos separados por comas (,)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Hectáreas</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    value={newLote.hectareas}
                    onChange={e => setNewLote({...newLote, hectareas: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    value={newLote.estado}
                    onChange={e => setNewLote({...newLote, estado: e.target.value})}
                  >
                    <option value="activo">Activo</option>
                    <option value="produccion">En Producción</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="descanso">Descanso</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-xl mt-4 hover:shadow-lg transition-all">
                {editingId ? 'Actualizar Lote' : 'Crear Lote'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center py-12">Cargando lotes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote) => (
            <div key={lote.id} className="card-agro group cursor-pointer relative" onClick={(e) => handleEdit(lote, e)}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[var(--muted)] p-3 rounded-xl text-[var(--primary)]">
                  <Map className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  lote.estado.toLowerCase().includes('producción') || lote.estado.toLowerCase() === 'produccion' ? 'bg-green-100 text-green-700' :
                  lote.estado.toLowerCase().includes('descanso') ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {lote.estado}
                </span>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={(e) => handleDelete(lote.id, e)} className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2">{lote.nombre}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(lote.cultivo || '').split(',').map((c: string, idx: number) => c.trim() && (
                  <span key={idx} className="bg-[var(--muted)] text-[var(--secondary)] text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Sprout className="w-3 h-3" />
                    {c.trim()}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Tamaño</p>
                  <p className="font-semibold">{lote.hectareas} Ha</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estado</p>
                  <p className="font-semibold text-gray-600">{lote.estado}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add Placeholder */}
          <div 
            onClick={() => {
              setNewLote({ nombre: '', cultivo: '', estado: 'activo', hectareas: 0 });
              setEditingId(null);
              setShowForm(true);
            }}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer h-[200px]"
          >
            <Plus className="w-12 h-12 mb-2" />
            <p className="font-medium">Agregar nuevo lote</p>
          </div>
        </div>
      )}
    </div>
  );
}

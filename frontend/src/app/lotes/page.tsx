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
    cultivo_principal: 'Café Castillo',
    cultivo_secundario: '',
    cultivo_terciario: '',
    arboles_principal: 0,
    arboles_secundario: 0,
    arboles_terciario: 0,
    estado: 'activo',
    hectareas: 0,
    numero_arboles: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadLotes = async () => {
    try {
      const data = await getLotes();
      setLotes(data);
    } catch (error) {
      console.error("Error loading lotes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLotes();
  }, []);

  const totalHectareas = lotes.reduce((acc, curr) => acc + (curr.hectareas || 0), 0);
  const totalArboles = lotes.reduce((acc, curr) => acc + (curr.numero_arboles || (curr.arboles_principal || 0) + (curr.arboles_secundario || 0) + (curr.arboles_terciario || 0)), 0);
  const densidadPromedio = totalHectareas > 0 ? Math.round(totalArboles / totalHectareas) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const combinedCultivo = [
        newLote.cultivo_principal?.trim(),
        newLote.cultivo_secundario?.trim(),
        newLote.cultivo_terciario?.trim()
      ].filter(Boolean).join(', ');

      const sumArboles = (newLote.arboles_principal || 0) + (newLote.arboles_secundario || 0) + (newLote.arboles_terciario || 0);

      const payload = {
        ...newLote,
        cultivo: combinedCultivo || newLote.cultivo || 'Café',
        numero_arboles: sumArboles > 0 ? sumArboles : (newLote.numero_arboles || 0)
      };

      if (editingId) {
        await updateLote(editingId, payload);
      } else {
        await createLote(payload);
      }
      setShowForm(false);
      setNewLote({ 
        nombre: '', 
        cultivo: '', 
        cultivo_principal: 'Café Castillo', 
        cultivo_secundario: '', 
        cultivo_terciario: '', 
        arboles_principal: 0,
        arboles_secundario: 0,
        arboles_terciario: 0,
        estado: 'activo', 
        hectareas: 0, 
        numero_arboles: 0 
      });
      setEditingId(null);
      loadLotes();
    } catch (error) {
      console.error("Error saving lote", error);
      alert("Error al guardar el lote.");
    }
  };

  const handleEdit = (lote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const parts = (lote.cultivo || '').split(',').map((p: string) => p.trim());
    setNewLote({ 
      nombre: lote.nombre, 
      cultivo: lote.cultivo || '', 
      cultivo_principal: lote.cultivo_principal || parts[0] || '',
      cultivo_secundario: lote.cultivo_secundario || parts[1] || '',
      cultivo_terciario: lote.cultivo_terciario || parts[2] || '',
      arboles_principal: lote.arboles_principal || 0,
      arboles_secundario: lote.arboles_secundario || 0,
      arboles_terciario: lote.arboles_terciario || 0,
      estado: lote.estado, 
      hectareas: lote.hectareas || 0,
      numero_arboles: lote.numero_arboles || 0
    });
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
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Fincas y Divisiones Agrícolas
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestión de Lotes</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Administra hectáreas, árboles por cultivo y densidad de siembra de La Leonora.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewLote({ 
              nombre: '', 
              cultivo: '', 
              cultivo_principal: 'Café Castillo', 
              cultivo_secundario: '', 
              cultivo_terciario: '', 
              arboles_principal: 0,
              arboles_secundario: 0,
              arboles_terciario: 0,
              estado: 'activo', 
              hectareas: 0, 
              numero_arboles: 0 
            });
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Lote
        </button>
      </header>

      {/* KPI Cards de Lotes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Lotes</p>
          <p className="text-2xl font-black text-slate-900">{lotes.length}</p>
        </div>
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Área Total (Ha)</p>
          <p className="text-2xl font-black text-slate-900">{totalHectareas.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Ha</p>
        </div>
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Árboles / Plantas</p>
          <p className="text-2xl font-black text-emerald-700">{totalArboles.toLocaleString()} 🌳</p>
        </div>
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Densidad Promedio</p>
          <p className="text-2xl font-black text-indigo-700">{densidadPromedio.toLocaleString()} <span className="text-xs font-normal text-slate-500">árboles/Ha</span></p>
        </div>
      </div>

      {/* Modal / Overlay Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">{editingId ? 'Actualizar Lote' : 'Crear Nuevo Lote'}</h3>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setNewLote({ 
                    nombre: '', 
                    cultivo: '', 
                    cultivo_principal: '', 
                    cultivo_secundario: '', 
                    cultivo_terciario: '', 
                    arboles_principal: 0,
                    arboles_secundario: 0,
                    arboles_terciario: 0,
                    estado: 'activo', 
                    hectareas: 0, 
                    numero_arboles: 0 
                  });
                }} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nombre del Lote</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Lote El Mirador"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold"
                  value={newLote.nombre}
                  onChange={e => setNewLote({...newLote, nombre: e.target.value})}
                />
              </div>

              {/* Cultivos estructurados con número de árboles por cada cultivo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" /> Cultivos y Conteo de Árboles
                </p>

                {/* Principal */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">🥇 Cultivo Principal (Requerido)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Café Castillo"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white font-semibold text-emerald-900"
                      value={newLote.cultivo_principal}
                      onChange={e => setNewLote({...newLote, cultivo_principal: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-emerald-700">Nº Árboles</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Ej: 12000"
                      className="w-full p-2.5 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-emerald-50/50 font-extrabold text-emerald-800 text-right"
                      value={Number.isNaN(newLote.arboles_principal) ? '' : newLote.arboles_principal}
                      onChange={e => setNewLote({...newLote, arboles_principal: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Secundario */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-medium text-slate-600">🥈 Cultivo Secundario (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Plátano Hartón"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                      value={newLote.cultivo_secundario}
                      onChange={e => setNewLote({...newLote, cultivo_secundario: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Nº Plantas</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 1500"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white font-bold text-slate-800 text-right"
                      value={Number.isNaN(newLote.arboles_secundario) ? '' : newLote.arboles_secundario}
                      onChange={e => setNewLote({...newLote, arboles_secundario: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Terciario */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-medium text-slate-600">🥉 Cultivo Terciario (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Aguacate Hass"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                      value={newLote.cultivo_terciario}
                      onChange={e => setNewLote({...newLote, cultivo_terciario: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Nº Árboles</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 300"
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white font-bold text-slate-800 text-right"
                      value={Number.isNaN(newLote.arboles_terciario) ? '' : newLote.arboles_terciario}
                      onChange={e => setNewLote({...newLote, arboles_terciario: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hectáreas (Ha)</label>
                  <input 
                    type="number" 
                    step="any" 
                    required
                    placeholder="0.0"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-bold"
                    value={Number.isNaN(newLote.hectareas) ? '' : newLote.hectareas}
                    onChange={e => setNewLote({...newLote, hectareas: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Estado del Lote</label>
                  <select 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
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

              <button type="submit" className="w-full py-3.5 bg-emerald-700 text-white font-bold rounded-xl mt-4 hover:bg-emerald-800 transition-all shadow-md">
                {editingId ? 'Actualizar Lote' : 'Guardar Lote'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center py-12 text-slate-500">Cargando lotes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote) => {
            const parts = (lote.cultivo || '').split(',').map((p: string) => p.trim()).filter(Boolean);
            const pri = lote.cultivo_principal || parts[0] || 'Café';
            const sec = lote.cultivo_secundario || parts[1] || null;
            const ter = lote.cultivo_terciario || parts[2] || null;

            const cantPri = lote.arboles_principal || 0;
            const cantSec = lote.arboles_secundario || 0;
            const cantTer = lote.arboles_terciario || 0;
            const totArbolesLote = lote.numero_arboles || (cantPri + cantSec + cantTer);
            const arbolesHa = lote.hectareas > 0 ? Math.round(totArbolesLote / lote.hectareas) : 0;

            return (
              <div key={lote.id} className="card-agro group cursor-pointer relative" onClick={(e) => handleEdit(lote, e)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-700">
                    <Map className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    lote.estado.toLowerCase().includes('producción') || lote.estado.toLowerCase() === 'produccion' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    lote.estado.toLowerCase().includes('descanso') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {lote.estado}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={(e) => handleDelete(lote.id, e)} className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm border border-slate-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{lote.nombre}</h3>
                
                {/* Desglose de cultivos principal, secundario, terciario con conteo individual */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-emerald-900 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-200/80">
                    <span>🥇 {pri}</span>
                    {cantPri > 0 && <span className="font-black text-emerald-700">{cantPri.toLocaleString()} 🌳</span>}
                  </div>
                  {sec && (
                    <div className="flex justify-between items-center text-xs font-medium text-slate-700 bg-slate-100/90 px-3 py-1 rounded-xl">
                      <span>🥈 {sec}</span>
                      {cantSec > 0 && <span className="font-bold text-slate-700">{cantSec.toLocaleString()} 🍌</span>}
                    </div>
                  )}
                  {ter && (
                    <div className="flex justify-between items-center text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
                      <span>🥉 {ter}</span>
                      {cantTer > 0 && <span className="font-bold text-slate-600">{cantTer.toLocaleString()} 🥑</span>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Área</p>
                    <p className="font-extrabold text-slate-800 text-sm">{lote.hectareas} Ha</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-bold uppercase">Total Plantas</p>
                    <p className="font-extrabold text-emerald-800 text-sm">{totArbolesLote.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                    <p className="text-[10px] text-indigo-700 font-bold uppercase">Densidad</p>
                    <p className="font-extrabold text-indigo-800 text-xs mt-0.5">{arbolesHa.toLocaleString()}/Ha</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Placeholder */}
          <div 
            onClick={() => {
              setNewLote({ 
                nombre: '', 
                cultivo: '', 
                cultivo_principal: 'Café Castillo', 
                cultivo_secundario: '', 
                cultivo_terciario: '', 
                arboles_principal: 0,
                arboles_secundario: 0,
                arboles_terciario: 0,
                estado: 'activo', 
                hectareas: 0, 
                numero_arboles: 0 
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/30 transition-all cursor-pointer h-[240px]"
          >
            <Plus className="w-10 h-10 mb-2" />
            <p className="font-bold text-sm">Agregar nuevo lote</p>
          </div>
        </div>
      )}
    </div>
  );
}

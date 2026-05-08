'use client';

import React, { useEffect, useState } from 'react';
import { TrendingDown, Plus, Calendar, Tag, Info, DollarSign, MapPin, Sprout, Edit2, Trash2, X, Package } from 'lucide-react';
import { getEgresos, createEgreso, updateEgreso, deleteEgreso, getLotes, getCategoriasEgreso, getProductos } from '@/lib/api';

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lote_id: '',
    producto_id: '',
    categoria: '',
    descripcion: '',
    valor: 0,
    tipo: 'Variable',
    cultivo: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const selectedLote = lotes.find(l => l.id.toString() === formData.lote_id?.toString());
  const cultivosDelLote = selectedLote && selectedLote.cultivo 
    ? selectedLote.cultivo.split(',').map((c: string) => c.trim()).filter((c: string) => c) 
    : [];

  const fetchData = async () => {
    try {
      const [egData, lotData, catData, prodData] = await Promise.all([
        getEgresos(),
        getLotes(),
        getCategoriasEgreso(),
        getProductos()
      ]);
      setEgresos(egData);
      setLotes(lotData);
      setCategorias(catData);
      setProductos(prodData);
      
      if (catData.length > 0 && !formData.categoria) {
        setFormData(prev => ({ ...prev, categoria: catData[0].nombre, tipo: catData[0].tipo_defecto || 'Variable' }));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoriaChange = (e: any) => {
    const selectedCat = categorias.find(c => c.nombre === e.target.value);
    setFormData({
      ...formData,
      categoria: e.target.value,
      tipo: selectedCat ? selectedCat.tipo_defecto : 'Variable'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        lote_id: formData.lote_id ? parseInt(formData.lote_id as string) : null,
        producto_id: formData.producto_id ? parseInt(formData.producto_id as string) : null
      };

      if (editingId) {
        await updateEgreso(editingId, payload);
      } else {
        await createEgreso(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        lote_id: '',
        producto_id: '',
        categoria: categorias.length > 0 ? categorias[0].nombre : '',
        descripcion: '',
        valor: 0,
        tipo: categorias.length > 0 ? categorias[0].tipo_defecto : 'Variable',
        cultivo: ''
      });
      fetchData();
    } catch (error) {
      console.error("Error saving egreso", error);
      alert("Error al guardar el egreso.");
    }
  };

  const handleEdit = (eg: any) => {
    setFormData({
      fecha: eg.fecha,
      lote_id: eg.lote_id?.toString() || '',
      producto_id: eg.producto_id?.toString() || '',
      categoria: eg.categoria,
      descripcion: eg.descripcion,
      valor: eg.valor,
      tipo: eg.tipo || 'Variable',
      cultivo: eg.cultivo || ''
    });
    setEditingId(eg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este egreso?")) {
      try {
        await deleteEgreso(id);
        fetchData();
      } catch (error) {
        alert("No se pudo eliminar");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Control de Egresos</h1>
          <p className="text-gray-500">Gestión de gastos, insumos y mano de obra.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) {
              setEditingId(null);
              setFormData({ fecha: new Date().toISOString().split('T')[0], lote_id: '', producto_id: '', categoria: categorias[0]?.nombre || '', descripcion: '', valor: 0, tipo: categorias[0]?.tipo_defecto || 'Variable', cultivo: '' });
            }
          }}
          className="btn-primary flex items-center gap-2 !bg-red-700 hover:!bg-red-800"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar Formulario' : 'Nuevo Egreso'}
        </button>
      </header>

      {showForm && (
        <div className="card-agro border-t-4 border-t-red-700 animate-in slide-in-from-top-4 duration-300 relative shadow-xl">
          <button onClick={() => { setShowForm(false); setEditingId(null); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
          <h3 className="text-lg font-semibold mb-6 text-red-700 flex items-center gap-2"><TrendingDown className="w-5 h-5"/> {editingId ? 'Actualizar Gasto' : 'Registrar Nuevo Gasto'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" /> Fecha
              </label>
              <input 
                type="date" 
                required
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> Lote Asociado
              </label>
              <select 
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.lote_id}
                onChange={e => setFormData({...formData, lote_id: e.target.value, cultivo: ''})}
              >
                <option value="">Gasto General (Sin Lote)</option>
                {lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Package className="w-4 h-4 text-gray-400" /> Producto (Para costeo directo)
              </label>
              <select 
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.producto_id}
                onChange={e => setFormData({...formData, producto_id: e.target.value})}
              >
                <option value="">Gasto General (Sin Producto)</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Tag className="w-4 h-4 text-gray-400" /> Categoría Dinámica
              </label>
              <select 
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.categoria}
                onChange={handleCategoriaChange}
                required
              >
                {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
              <p className="text-xs text-gray-400">Las categorías se editan en Configuración.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Tag className="w-4 h-4 text-gray-400" /> Tipo de Costo
              </label>
              <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, tipo: 'Variable'})}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.tipo === 'Variable' || formData.tipo === 'variable' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Variable
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, tipo: 'Fijo'})}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.tipo === 'Fijo' || formData.tipo === 'fijo' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Fijo
                </button>
              </div>
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" /> Valor Pagado
              </label>
              <input 
                type="number" 
                required
                placeholder="$0" 
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-lg" 
                value={Number.isNaN(formData.valor) ? '' : formData.valor}
                onChange={e => setFormData({...formData, valor: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2 lg:col-span-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Info className="w-4 h-4 text-gray-400" /> Descripción / Notas
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Pago de semana a 3 recolectores" 
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>

            <div className="lg:col-span-3 pt-2">
              <button type="submit" className="w-full py-4 text-lg font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30">
                {editingId ? 'Actualizar Egreso' : 'Guardar Egreso'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card-agro">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">Historial de Gastos</h3>
          {loading ? (
            <p className="text-center py-8">Cargando egresos...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="pb-4 font-medium uppercase text-xs tracking-wider">Fecha</th>
                    <th className="pb-4 font-medium uppercase text-xs tracking-wider">Lote / Producto</th>
                    <th className="pb-4 font-medium uppercase text-xs tracking-wider">Categoría</th>
                    <th className="pb-4 font-medium uppercase text-xs tracking-wider text-right">Valor</th>
                    <th className="pb-4 font-medium uppercase text-xs tracking-wider text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {egresos.map((eg) => (
                    <tr key={eg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-medium text-gray-600">{eg.fecha}</td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{eg.lote?.nombre || 'General'}</span>
                          {eg.producto_id && <span className="text-xs text-blue-600">Prod: {productos.find(p=>p.id===eg.producto_id)?.nombre || eg.producto_id}</span>}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                          {eg.categoria}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-red-600">-${eg.valor?.toLocaleString()}</td>
                      <td className="py-4 flex justify-center gap-2">
                        <button onClick={() => handleEdit(eg)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border border-gray-100"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(eg.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-100"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {egresos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500 italic bg-gray-50 rounded-xl">No hay registros de egresos aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card-agro bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl shadow-gray-900/20 border-none">
            <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
               <DollarSign className="w-4 h-4 text-green-400" /> Presupuesto Ejecutado
            </h4>
            <div className="flex justify-between items-end">
              <p className="text-4xl font-black text-white tracking-tight">${egresos.reduce((acc, curr) => acc + curr.valor, 0).toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">Total acumulado histórico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

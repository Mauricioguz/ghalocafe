'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Calendar, Package, DollarSign, MapPin, Sprout, Edit2, Trash2, X } from 'lucide-react';
import { getIngresos, createIngreso, updateIngreso, deleteIngreso, getLotes, getProductos } from '@/lib/api';

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lote_id: '',
    producto_id: '',
    cantidad: 0,
    precio_unitario: 0,
    cultivo: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const selectedLote = lotes.find(l => l.id.toString() === formData.lote_id?.toString());
  const cultivosDelLote = selectedLote && selectedLote.cultivo 
    ? selectedLote.cultivo.split(',').map((c: string) => c.trim()).filter((c: string) => c) 
    : [];

  const fetchData = async () => {
    try {
      const [ingData, lotData, prodData] = await Promise.all([
        getIngresos(),
        getLotes(),
        getProductos()
      ]);
      setIngresos(ingData);
      setLotes(lotData);
      setProductos(prodData);
    } catch (error) {
      console.error("Error fetching data", error);
      // Fallback for demo
      setIngresos([
        { id: 1, fecha: '2026-04-12', lote: { nombre: 'Lote Norte' }, producto: { nombre: 'Café Pergamino' }, cantidad: 120, precio_unitario: 15000, total: 1800000 },
        { id: 2, fecha: '2026-04-10', lote: { nombre: 'Lote Sur' }, producto: { nombre: 'Café Pergamino' }, cantidad: 85, precio_unitario: 15200, total: 1292000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total = formData.cantidad * formData.precio_unitario;
      if (editingId) {
        await updateIngreso(editingId, { ...formData, total });
      } else {
        await createIngreso({ ...formData, total });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        lote_id: '',
        producto_id: '',
        cantidad: 0,
        precio_unitario: 0,
        cultivo: ''
      });
      fetchData();
    } catch (error) {
      console.error("Error saving ingreso", error);
      alert("Error al guardar el ingreso.");
    }
  };

  const handleEdit = (ing: any) => {
    setFormData({
      fecha: ing.fecha,
      lote_id: ing.lote_id?.toString() || '',
      producto_id: ing.producto_id?.toString() || '',
      cantidad: ing.cantidad,
      precio_unitario: ing.precio_unitario,
      cultivo: ing.cultivo || ''
    });
    setEditingId(ing.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ingreso?")) {
      try {
        await deleteIngreso(id);
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
          <h1 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Registro de Ingresos</h1>
          <p className="text-gray-500">Control de producción y ventas agrícolas.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) {
              setEditingId(null);
              setFormData({ fecha: new Date().toISOString().split('T')[0], lote_id: '', producto_id: '', cantidad: 0, precio_unitario: 0, cultivo: '' });
            }
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar Formulario' : 'Nuevo Ingreso'}
        </button>
      </header>

      {showForm && (
        <div className="card-agro animate-in slide-in-from-top-4 duration-300 relative">
          <button onClick={() => { setShowForm(false); setEditingId(null); setFormData({ fecha: new Date().toISOString().split('T')[0], lote_id: '', producto_id: '', cantidad: 0, precio_unitario: 0, cultivo: '' }); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
          <h3 className="text-lg font-semibold mb-6">{editingId ? 'Actualizar Registro de Venta/Producción' : 'Nuevo Registro de Venta/Producción'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Fecha
              </label>
              <input 
                type="date" 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none" 
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Lote
              </label>
              <select 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={formData.lote_id}
                onChange={e => setFormData({...formData, lote_id: e.target.value, cultivo: ''})}
              >
                <option value="">Seleccionar Lote</option>
                {lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Sprout className="w-4 h-4" /> Cultivo Asociado (Opcional)
              </label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none disabled:bg-gray-50"
                value={formData.cultivo}
                onChange={e => setFormData({...formData, cultivo: e.target.value})}
                disabled={!formData.lote_id || cultivosDelLote.length === 0}
              >
                <option value="">General (Todo el lote)</option>
                {cultivosDelLote.map((c: string, idx: number) => <option key={idx} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Package className="w-4 h-4" /> Producto
              </label>
              <select 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={formData.producto_id}
                onChange={e => setFormData({...formData, producto_id: e.target.value})}
              >
                <option value="">Seleccionar Producto</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                {productos.length === 0 && <option disabled>Carga productos en Configuración primero</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Cantidad
              </label>
              <input 
                type="number" 
                required
                step="0.01"
                placeholder="0.00" 
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none" 
                value={Number.isNaN(formData.cantidad) ? '' : formData.cantidad}
                onChange={e => setFormData({...formData, cantidad: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> Precio por Unidad
              </label>
              <input 
                type="number" 
                required
                placeholder="$0.00" 
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none" 
                value={Number.isNaN(formData.precio_unitario) ? '' : formData.precio_unitario}
                onChange={e => setFormData({...formData, precio_unitario: parseFloat(e.target.value)})}
              />
            </div>

            <div className="lg:col-span-3 pt-4">
              <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                {editingId ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-agro">
        <h3 className="text-lg font-semibold mb-6">Histórico de Movimientos</h3>
        {loading ? (
          <p className="text-center py-8">Cargando movimientos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider">Fecha</th>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider">Lote / Cultivo</th>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider">Producto</th>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider">Cantidad</th>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider text-right">Total</th>
                  <th className="pb-4 font-medium uppercase text-xs tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ingresos.map((ing) => (
                  <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm">{ing.fecha}</td>
                    <td className="py-4 font-medium">
                      {ing.lote?.nombre || 'N/A'}
                      {ing.cultivo && <span className="block text-xs text-gray-500 font-normal mt-1 border border-gray-200 rounded px-1.5 py-0.5 inline-block bg-white">{ing.cultivo}</span>}
                    </td>
                    <td className="py-4 text-[var(--primary)]">{ing.producto?.nombre || 'N/A'}</td>
                    <td className="py-4 text-sm">{ing.cantidad} {ing.producto?.unidad || ''}</td>
                    <td className="py-4 text-right font-bold text-green-700">${ing.total?.toLocaleString()}</td>
                    <td className="py-4 flex justify-end gap-2">
                      <button onClick={() => handleEdit(ing)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border border-gray-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-100"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {ingresos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 italic">No hay registros aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

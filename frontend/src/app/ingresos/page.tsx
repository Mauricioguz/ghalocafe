'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Calendar, Package, DollarSign, MapPin, Sprout, Edit2, Trash2, X } from 'lucide-react';
import { getIngresos, createIngreso, updateIngreso, deleteIngreso, getLotes, getProductos, createProducto, createLote } from '@/lib/api';

const formatCOP = (val: number | null | undefined) => {
  if (val === undefined || val === null || isNaN(val)) return '$ 0,00';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Quick modals for inline creation
  const [showQuickProdModal, setShowQuickProdModal] = useState(false);
  const [quickProd, setQuickProd] = useState({ nombre: '', unidad: 'Kg' });

  const [showQuickLoteModal, setShowQuickLoteModal] = useState(false);
  const [quickLote, setQuickLote] = useState({ nombre: '', cultivo_principal: 'Café Castillo', hectareas: 1.0, estado: 'activo' });

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lote_id: '',
    producto_id: '',
    cantidad: 0,
    precio_unitario: 0,
    total: 0,
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

      if (prodData.length > 0 && !formData.producto_id) {
        setFormData(prev => ({ ...prev, producto_id: prodData[0].id.toString() }));
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

  const handleCantidadChange = (val: number) => {
    const newTotal = Math.round((val * (formData.precio_unitario || 0)) * 100) / 100;
    setFormData(prev => ({ ...prev, cantidad: val, total: newTotal }));
  };

  const handlePrecioUnitarioChange = (val: number) => {
    const newTotal = Math.round(((formData.cantidad || 0) * val) * 100) / 100;
    setFormData(prev => ({ ...prev, precio_unitario: val, total: newTotal }));
  };

  const handleTotalChange = (val: number) => {
    const rawUnit = formData.cantidad > 0 ? val / formData.cantidad : 0;
    const calcUnit = Math.round(rawUnit * 100) / 100;
    setFormData(prev => ({ ...prev, total: val, precio_unitario: calcUnit }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const calcTotal = formData.total > 0 ? formData.total : (formData.cantidad * formData.precio_unitario);
      const payload = {
        fecha: formData.fecha,
        lote_id: formData.lote_id ? parseInt(formData.lote_id as string) : null,
        producto_id: formData.producto_id ? parseInt(formData.producto_id as string) : null,
        cantidad: formData.cantidad || 0,
        precio_unitario: formData.precio_unitario || 0,
        total: Math.round((calcTotal || 0) * 100) / 100,
        cultivo: formData.cultivo || ''
      };

      if (editingId) {
        await updateIngreso(editingId, payload);
      } else {
        await createIngreso(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        lote_id: '',
        producto_id: productos.length > 0 ? productos[0].id.toString() : '',
        cantidad: 0,
        precio_unitario: 0,
        total: 0,
        cultivo: ''
      });
      fetchData();
    } catch (error) {
      console.error("Error saving ingreso", error);
      alert("Error al guardar el ingreso.");
    }
  };

  const handleQuickProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickProd.nombre.trim()) return;
    try {
      const created = await createProducto(quickProd);
      await fetchData();
      setFormData(prev => ({ ...prev, producto_id: created.id.toString() }));
      setQuickProd({ nombre: '', unidad: 'Kg' });
      setShowQuickProdModal(false);
    } catch (err) {
      alert("Error al crear producto.");
    }
  };

  const handleQuickLoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLote.nombre.trim()) return;
    try {
      const created = await createLote({
        ...quickLote,
        cultivo: quickLote.cultivo_principal
      });
      await fetchData();
      setFormData(prev => ({ ...prev, lote_id: created.id.toString() }));
      setQuickLote({ nombre: '', cultivo_principal: 'Café Castillo', hectareas: 1.0, estado: 'activo' });
      setShowQuickLoteModal(false);
    } catch (err) {
      alert("Error al crear lote.");
    }
  };

  const handleEdit = (ing: any) => {
    setFormData({
      fecha: ing.fecha,
      lote_id: ing.lote_id?.toString() || '',
      producto_id: ing.producto_id?.toString() || '',
      cantidad: ing.cantidad || 0,
      precio_unitario: ing.precio_unitario || 0,
      total: ing.total || 0,
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

  const totalIngresosGral = ingresos.reduce((acc, curr) => acc + (curr.total || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Gestión Comercial y Producción
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Registro de Ingresos</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Control de cosechas, ventas de café y productos agrícolas de La Leonora.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) {
              setEditingId(null);
              setFormData({ fecha: new Date().toISOString().split('T')[0], lote_id: '', producto_id: productos.length > 0 ? productos[0].id.toString() : '', cantidad: 0, precio_unitario: 0, total: 0, cultivo: '' });
            }
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar Formulario' : 'Nuevo Ingreso'}
        </button>
      </header>

      {/* KPI Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Ingresos Registrados</p>
          <p className="text-2xl font-black text-emerald-700">{formatCOP(totalIngresosGral)}</p>
        </div>
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Número de Ventas / Cosechas</p>
          <p className="text-2xl font-black text-slate-900">{ingresos.length}</p>
        </div>
        <div className="card-agro">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Promedio por Transacción</p>
          <p className="text-2xl font-black text-indigo-700">{formatCOP(ingresos.length > 0 ? totalIngresosGral / ingresos.length : 0)}</p>
        </div>
      </div>

      {/* Modal / Quick Product Creator */}
      {showQuickProdModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-slate-900">Crear Nuevo Producto</h4>
              <button onClick={() => setShowQuickProdModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <form onSubmit={handleQuickProdSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Café Pergamino Seco"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold mt-1"
                  value={quickProd.nombre}
                  onChange={e => setQuickProd({ ...quickProd, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Unidad de Medida</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Kg, Arroba, Carga, Kilo"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm mt-1"
                  value={quickProd.unidad}
                  onChange={e => setQuickProd({ ...quickProd, unidad: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:bg-emerald-800 transition-all text-sm">
                Guardar Producto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Quick Lote Creator */}
      {showQuickLoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-slate-900">Crear Nuevo Lote</h4>
              <button onClick={() => setShowQuickLoteModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <form onSubmit={handleQuickLoteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Nombre del Lote</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Lote El Mirador"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold mt-1"
                  value={quickLote.nombre}
                  onChange={e => setQuickLote({ ...quickLote, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Cultivo Principal</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Café Castillo"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm mt-1"
                  value={quickLote.cultivo_principal}
                  onChange={e => setQuickLote({ ...quickLote, cultivo_principal: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Hectáreas (Ha)</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  placeholder="1.0"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-bold mt-1"
                  value={quickLote.hectareas}
                  onChange={e => setQuickLote({ ...quickLote, hectareas: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:bg-emerald-800 transition-all text-sm">
                Guardar Lote
              </button>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card-agro animate-in slide-in-from-top-4 duration-300 relative border border-slate-200 shadow-md">
          <button onClick={() => { setShowForm(false); setEditingId(null); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100"><X className="w-5 h-5"/></button>
          <h3 className="text-xl font-extrabold mb-6 text-slate-900">{editingId ? 'Actualizar Registro de Venta / Producción' : 'Nuevo Registro de Venta / Producción'}</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-600" /> Fecha
              </label>
              <input 
                type="date" 
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-medium" 
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Lote
                </label>
                <button 
                  type="button"
                  onClick={() => setShowQuickLoteModal(true)} 
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100"
                >
                  + Nuevo Lote
                </button>
              </div>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm bg-white font-medium"
                value={formData.lote_id}
                onChange={e => setFormData({...formData, lote_id: e.target.value, cultivo: ''})}
              >
                <option value="">General / Toda la Finca (Sin Lote)</option>
                {lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Sprout className="w-4 h-4 text-emerald-600" /> Cultivo Asociado (Opcional)
              </label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm bg-white disabled:bg-slate-50 font-medium"
                value={formData.cultivo}
                onChange={e => setFormData({...formData, cultivo: e.target.value})}
                disabled={!formData.lote_id || cultivosDelLote.length === 0}
              >
                <option value="">General (Todo el lote)</option>
                {cultivosDelLote.map((c: string, idx: number) => <option key={idx} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Package className="w-4 h-4 text-emerald-600" /> Producto Agrícola
                </label>
                <button 
                  type="button"
                  onClick={() => setShowQuickProdModal(true)} 
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100"
                >
                  + Nuevo Producto
                </button>
              </div>
              <select 
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm bg-white font-semibold text-slate-900"
                value={formData.producto_id}
                onChange={e => setFormData({...formData, producto_id: e.target.value})}
              >
                <option value="">Seleccionar Producto</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.unidad})</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Plus className="w-4 h-4 text-emerald-600" /> Cantidad
              </label>
              <input 
                type="number" 
                required
                step="any"
                placeholder="Ej: 52.5" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-bold" 
                value={Number.isNaN(formData.cantidad) || formData.cantidad === 0 ? '' : formData.cantidad}
                onChange={e => handleCantidadChange(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Precio por Unidad (COP)
              </label>
              <input 
                type="number" 
                required
                step="any"
                placeholder="Ej: 1105166" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-bold text-slate-800" 
                value={Number.isNaN(formData.precio_unitario) || formData.precio_unitario === 0 ? '' : formData.precio_unitario}
                onChange={e => handlePrecioUnitarioChange(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5 lg:col-span-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  💵 Valor Total Venta (COP)
                </label>
                <span className="text-xs font-medium text-emerald-700">Puedes ingresar directamente el Total o calcularlo por cantidad</span>
              </div>
              <input 
                type="number" 
                step="any"
                placeholder="Ej: 58021215" 
                className="w-full p-3.5 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-lg font-black text-emerald-800 bg-white" 
                value={Number.isNaN(formData.total) || formData.total === 0 ? '' : formData.total}
                onChange={e => handleTotalChange(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="lg:col-span-3 pt-2">
              <button type="submit" className="btn-primary w-full py-4 text-base font-extrabold shadow-md">
                {editingId ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-agro">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold text-slate-900">Histórico de Movimientos de Ingreso</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{ingresos.length} registros</span>
        </div>

        {loading ? (
          <p className="text-center py-12 text-slate-500">Cargando movimientos...</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[550px] pr-2">
            <table className="w-full text-left border-collapse">
              <thead className="text-slate-500 border-b-2 border-slate-100 sticky top-0 bg-white z-10 shadow-sm">
                <tr>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider">Fecha</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider">Lote / Cultivo</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider">Producto</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider text-right">Cantidad</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider text-right">Precio Unit.</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider text-right">Total (COP)</th>
                  <th className="pb-3 pt-1 px-3 font-semibold uppercase text-xs tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ingresos.map((ing) => {
                  const loteObj = ing.lote || lotes.find(l => l.id.toString() === ing.lote_id?.toString());
                  const prodObj = ing.producto || productos.find(p => p.id.toString() === ing.producto_id?.toString());
                  const loteNombre = loteObj ? loteObj.nombre : (ing.lote_id ? `Lote #${ing.lote_id}` : 'General / Finca');
                  const prodNombre = prodObj ? prodObj.nombre : (ing.producto_id ? `Producto #${ing.producto_id}` : 'Café / Producto');
                  const prodUnidad = prodObj ? prodObj.unidad : '';

                  return (
                    <tr key={ing.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-3 text-xs font-semibold text-slate-600">{ing.fecha}</td>
                      <td className="py-4 px-3 font-bold text-slate-800 text-sm">
                        {loteNombre}
                        {ing.cultivo && (
                          <span className="block text-[11px] text-emerald-800 font-semibold mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-100">
                            🌱 {ing.cultivo}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-sm font-semibold text-slate-900">
                        {prodNombre}
                      </td>
                      <td className="py-4 px-3 text-sm text-right font-bold text-slate-700">
                        {Number(ing.cantidad || 0).toFixed(2)} <span className="text-xs font-normal text-slate-500">{prodUnidad}</span>
                      </td>
                      <td className="py-4 px-3 text-sm text-right text-slate-600 font-semibold">
                        {formatCOP(ing.precio_unitario || 0)}
                      </td>
                      <td className="py-4 px-3 text-right font-black text-emerald-700 text-base">
                        {formatCOP(ing.total || 0)}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex justify-center items-center gap-1.5">
                          <button onClick={() => handleEdit(ing)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white rounded-lg shadow-sm border border-slate-200">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm border border-slate-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {ingresos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic font-medium">No hay registros de ingreso aún. Utiliza el botón "+ Nuevo Ingreso" para registrar ventas o cosechas.</td>
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

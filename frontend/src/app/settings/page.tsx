'use client';

import React, { useEffect, useState } from 'react';
import { Settings, User, Bell, Shield, Database, Trash2, Package, Plus, Edit2, X, Tag } from 'lucide-react';
import { getProductos, createProducto, updateProducto, deleteProducto, getConfiguracion, updateConfiguracion, getCategoriasEgreso, createCategoriaEgreso, updateCategoriaEgreso, deleteCategoriaEgreso } from '@/lib/api';

export default function SettingsPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  
  const [showProdForm, setShowProdForm] = useState(false);
  const [newProducto, setNewProducto] = useState({ nombre: '', unidad: 'kg' });
  const [editingProdId, setEditingProdId] = useState<number | null>(null);
  
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCategoria, setNewCategoria] = useState({ nombre: '', tipo_defecto: 'Variable', clasificacion_contable: 'Costo de Producción' });
  const [editingCatId, setEditingCatId] = useState<number | null>(null);

  const [config, setConfig] = useState({
    nombre_finca: 'La Leonora',
    propietario: 'Administrador',
    ubicacion: 'Vereda El Placer',
    moneda: 'COP',
  });
  const [loadingConfig, setLoadingConfig] = useState(false);

  const loadData = async () => {
    try {
      const [dataProd, dataConfig, dataCat] = await Promise.all([
        getProductos(),
        getConfiguracion(),
        getCategoriasEgreso()
      ]);
      setProductos(dataProd);
      setConfig(dataConfig);
      setCategorias(dataCat);
    } catch(e) { console.error(e) }
  };

  useEffect(() => { loadData(); }, []);

  // --- PRODUCTOS ---
  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProdId) {
        await updateProducto(editingProdId, newProducto);
      } else {
        await createProducto(newProducto);
      }
      setShowProdForm(false);
      setEditingProdId(null);
      setNewProducto({ nombre: '', unidad: 'kg' });
      loadData();
    } catch (error) {
      alert("Error guardando producto.");
    }
  };

  const handleEditProd = (prod: any) => {
    setNewProducto({ nombre: prod.nombre, unidad: prod.unidad });
    setEditingProdId(prod.id);
    setShowProdForm(true);
  };

  const handleDeleteProd = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteProducto(id);
        loadData();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  // --- CATEGORIAS ---
  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await updateCategoriaEgreso(editingCatId, newCategoria);
      } else {
        await createCategoriaEgreso(newCategoria);
      }
      setShowCatForm(false);
      setEditingCatId(null);
      setNewCategoria({ nombre: '', tipo_defecto: 'Variable', clasificacion_contable: 'Costo de Producción' });
      loadData();
    } catch (error) {
      alert("Error guardando categoría.");
    }
  };

  const handleEditCat = (cat: any) => {
    setNewCategoria({ nombre: cat.nombre, tipo_defecto: cat.tipo_defecto, clasificacion_contable: cat.clasificacion_contable || 'Costo de Producción' });
    setEditingCatId(cat.id);
    setShowCatForm(true);
  };

  const handleDeleteCat = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        await deleteCategoriaEgreso(id);
        loadData();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleSaveConfig = async () => {
    setLoadingConfig(true);
    try {
      await updateConfiguracion(config);
      alert("Configuración guardada exitosamente.");
    } catch (error) {
      alert("Error al guardar la configuración.");
    } finally {
      setLoadingConfig(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--secondary)]">Configuración</h1>
        <p className="text-gray-500">Administra las preferencias de La Leonora y los parámetros del sistema.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile / Farm Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-agro">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--primary)]" />
              Información de la Finca
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre de la Finca</label>
                <input type="text" value={config.nombre_finca} onChange={(e) => setConfig({...config, nombre_finca: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Propietario</label>
                <input type="text" value={config.propietario} onChange={(e) => setConfig({...config, propietario: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ubicación</label>
                <input type="text" value={config.ubicacion} onChange={(e) => setConfig({...config, ubicacion: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Moneda del Sistema</label>
                <select value={config.moneda} onChange={(e) => setConfig({...config, moneda: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="COP">Pesos Colombianos (COP)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveConfig} 
                disabled={loadingConfig} 
                className="btn-primary"
              >
                {loadingConfig ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Productos */}
            <div className="card-agro">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--primary)]" />
                  Productos
                </h3>
                <button onClick={() => { setShowProdForm(true); setEditingProdId(null); setNewProducto({ nombre: '', unidad: 'kg' }); }} className="btn-primary py-1 px-3 text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              </div>
              
              {showProdForm && (
                <form onSubmit={handleProdSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{editingProdId ? 'Editar Producto' : 'Crear Producto'}</h4>
                    <button type="button" onClick={() => setShowProdForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Nombre</label>
                      <input required type="text" value={newProducto.nombre} onChange={e => setNewProducto({...newProducto, nombre: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-[var(--primary)]" placeholder="Café Pergamino" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Unidad</label>
                      <input required type="text" value={newProducto.unidad} onChange={e => setNewProducto({...newProducto, unidad: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-[var(--primary)]" placeholder="kg" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[var(--primary)] text-white text-sm py-2 rounded-lg font-bold">{editingProdId ? 'Actualizar' : 'Guardar'}</button>
                </form>
              )}

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {productos.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                    <div>
                      <p className="font-medium text-sm">{p.nombre}</p>
                      <p className="text-xs text-gray-500">Unidad: {p.unidad}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditProd(p)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProd(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {productos.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No hay productos.</p>}
              </div>
            </div>

            {/* Categorias de Egreso */}
            <div className="card-agro">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-600" />
                  Categorías Egresos
                </h3>
                <button onClick={() => { setShowCatForm(true); setEditingCatId(null); setNewCategoria({ nombre: '', tipo_defecto: 'Variable', clasificacion_contable: 'Costo de Producción' }); }} className="btn-primary !bg-red-600 hover:!bg-red-700 py-1 px-3 text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Nueva
                </button>
              </div>
              
              {showCatForm && (
                <form onSubmit={handleCatSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{editingCatId ? 'Editar Categoría' : 'Crear Categoría'}</h4>
                    <button type="button" onClick={() => setShowCatForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Nombre de la Categoría</label>
                      <input required type="text" value={newCategoria.nombre} onChange={e => setNewCategoria({...newCategoria, nombre: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-red-600" placeholder="Ej: Arrendamientos" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Clasificación P&G</label>
                      <select required value={newCategoria.clasificacion_contable} onChange={e => setNewCategoria({...newCategoria, clasificacion_contable: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-red-600 bg-white">
                        <option value="Costo de Producción">Costo de Producción</option>
                        <option value="Gasto Administrativo">Gasto Administrativo</option>
                        <option value="Gasto de Ventas">Gasto de Ventas</option>
                        <option value="Gasto Financiero">Gasto Financiero</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Tipo por Defecto</label>
                      <select required value={newCategoria.tipo_defecto} onChange={e => setNewCategoria({...newCategoria, tipo_defecto: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-red-600 bg-white">
                        <option value="Variable">Variable</option>
                        <option value="Fijo">Fijo</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-red-600 text-white text-sm py-2 rounded-lg font-bold">{editingCatId ? 'Actualizar' : 'Guardar'}</button>
                </form>
              )}

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {categorias.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                    <div>
                      <p className="font-medium text-sm">{c.nombre}</p>
                      <p className="text-xs text-gray-500">{c.clasificacion_contable} • {c.tipo_defecto}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCat(c)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCat(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {categorias.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No hay categorías.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* System / Security */}
        <div className="space-y-6">
          <div className="card-agro">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--primary)]" />
              Base de Datos
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                <p className="font-medium text-sm text-[var(--secondary)]">Exportar Backup completo</p>
                <p className="text-xs text-gray-500">Descarga todos tus datos en formato JSON/Excel.</p>
              </button>
              <button className="w-full text-left p-4 hover:bg-red-50 rounded-xl transition-colors border border-red-100 group">
                <p className="font-medium text-sm text-red-600 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Vaciar Base de Datos
                </p>
                <p className="text-xs text-red-400">Esta acción no se puede deshacer. Se borrarán todos los registros.</p>
              </button>
            </div>
          </div>

          <div className="card-agro">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--primary)]" />
              Notificaciones
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">Alertas de Presupuesto</p>
                  <p className="text-xs text-gray-500">Notificar cuando un lote supere el 90%.</p>
                </div>
                <div className="w-12 h-6 bg-[var(--primary)] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-agro bg-[var(--muted)] border-none">
            <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-[var(--secondary)]">
              <Shield className="w-5 h-5" />
              Seguridad
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Tu sesión está protegida con encriptación de nivel bancario. Último acceso: hace 5 minutos.
            </p>
            <button className="w-full py-2 bg-white text-gray-700 text-sm font-bold rounded-lg border border-gray-200 hover:shadow-sm">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

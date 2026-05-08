'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieChartIcon,
  Plus,
  Activity,
  Percent,
  CalendarDays,
  FileText,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { getStats } from '@/lib/api';

const COLORS_CAT = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'];
const COLORS_TYPE = ['#3B82F6', '#EF4444'];
const COLORS_PROD = ['#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getStats(startDate, endDate);
      setStats(data);
    } catch (error) {
      console.error("Error loading stats", error);
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleFilter = () => {
    loadStats();
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    getStats('', '').then(data => setStats(data));
  };

  if (!stats && loading) return (
    <div className="flex justify-center items-center h-full min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 glass p-6 rounded-3xl border border-white/40 shadow-xl shadow-emerald-900/5">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">Business Intelligence</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">Resumen financiero y rendimiento productivo de La Leonora.</p>
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-500/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-3">
            <CalendarDays className="w-5 h-5 text-emerald-500" />
            <input 
              type="date" 
              className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-emerald-200 font-bold">|</span>
          <div className="flex items-center gap-2 px-3">
            <input 
              type="date" 
              className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={handleFilter} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all">
            <Filter className="w-4 h-4" />
          </button>
          {(startDate || endDate) && (
            <button onClick={handleClearFilter} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl text-sm font-bold transition-all">
              Limpiar
            </button>
          )}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-800">${stats?.total_ingresos?.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-2xl text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Costos Totales</p>
              <p className="text-3xl font-bold text-gray-800">${stats?.total_egresos?.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-2xl text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Utilidad Neta</p>
              <p className="text-3xl font-bold text-[var(--primary)]">${stats?.utilidad_neta?.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Margen Neta (%)</p>
              <p className="text-3xl font-bold text-purple-700">{stats?.margen_ganancia?.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Percent className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* P&L Statement (PyG) */}
        <div className="card-agro-premium flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <FileText className="w-6 h-6 text-blue-600" />
              Estado de Resultados (P&G)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-800 font-bold">Ingresos Operacionales</span>
                <span className="font-bold text-emerald-600">${stats?.pyg_consolidado?.ingresos_operacionales?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 pl-4">
                <span className="text-gray-500">(-) Costos de Producción</span>
                <span className="font-semibold text-rose-500">${stats?.pyg_consolidado?.costos_produccion?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200 bg-gray-50/50 rounded-lg px-2">
                <span className="text-gray-800 font-bold">(=) Utilidad Bruta</span>
                <span className="font-bold text-blue-600">${stats?.pyg_consolidado?.utilidad_bruta?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos Administrativos</span>
                <span className="font-semibold text-rose-500 text-sm">${stats?.pyg_consolidado?.gastos_administrativos?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos de Ventas</span>
                <span className="font-semibold text-rose-500 text-sm">${stats?.pyg_consolidado?.gastos_ventas?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200 bg-gray-50/50 rounded-lg px-2">
                <span className="text-gray-800 font-bold">(=) Utilidad Operacional</span>
                <span className="font-bold text-blue-600">${stats?.pyg_consolidado?.utilidad_operacional?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos Financieros</span>
                <span className="font-semibold text-rose-500 text-sm">${stats?.pyg_consolidado?.gastos_financieros?.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 flex justify-between items-center">
            <span className="text-lg font-black text-green-900 uppercase tracking-wider">Utilidad Neta</span>
            <span className="text-2xl font-black text-green-700">${stats?.pyg_consolidado?.utilidad_neta?.toLocaleString()}</span>
          </div>
        </div>

        {/* Flujo de Caja (Bar + Line) */}
        <div className="card-agro-premium lg:col-span-2 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <Activity className="w-6 h-6 text-[var(--primary)]" />
            Flujo de Caja Mensual
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats?.flujo_caja_mensual} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="egresos" name="Egresos" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line type="monotone" dataKey="utilidad" name="Utilidad" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Product & Lot Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Costos por Categoria y Tipo */}
        <div className="flex flex-col gap-8">
          <div className="card-agro-premium flex flex-col h-[300px]">
             <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-800">
              <PieChartIcon className="w-5 h-5 text-[var(--accent)]" />
              Distribución de Costos (Categoría)
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.costos_por_categoria}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={5}
                    dataKey="value" nameKey="category"
                  >
                    {stats?.costos_por_categoria?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS_CAT[index % COLORS_CAT.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Rentabilidad por Producto */}
        <div className="card-agro-premium h-[300px] flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Activity className="w-5 h-5 text-amber-500" />
            Rentabilidad por Producto
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.rentabilidad_productos} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 600, fill: '#374151'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="egresos" name="Egresos (Asignados)" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Lot Performance Table */}
      <div className="card-agro-premium">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Desempeño Operativo por Lote</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 pt-2 px-4 font-semibold text-gray-500 uppercase tracking-wider text-sm">Lote</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-gray-500 uppercase tracking-wider text-sm text-right">Ingresos</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-gray-500 uppercase tracking-wider text-sm text-right">Costos</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-gray-500 uppercase tracking-wider text-sm text-center">Margen (%)</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-gray-500 uppercase tracking-wider text-sm">Balance Visual</th>
              </tr>
            </thead>
            <tbody>
              {stats?.rentabilidad_lotes?.map((lote: any, i: number) => {
                const marginPercent = lote.ingresos > 0 ? ((lote.neto / lote.ingresos) * 100) : (lote.egresos > 0 ? -100 : 0);
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4 font-bold text-gray-700">{lote.name}</td>
                    <td className="py-4 px-4 text-emerald-600 font-semibold text-right">${lote.ingresos.toLocaleString()}</td>
                    <td className="py-4 px-4 text-rose-600 font-semibold text-right">${lote.egresos.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${marginPercent > 20 ? 'bg-emerald-100 text-emerald-700' : marginPercent > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 w-1/3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                        <div className="bg-emerald-500 h-2 rounded-l-full" style={{ width: `${Math.max(0, Math.min(100, (lote.ingresos / (lote.ingresos + lote.egresos || 1)) * 100))}%` }}></div>
                        <div className="bg-rose-500 h-2 rounded-r-full" style={{ width: `${Math.max(0, Math.min(100, (lote.egresos / (lote.ingresos + lote.egresos || 1)) * 100))}%` }}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

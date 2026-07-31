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

const COLORS_CAT = ['#059669', '#D97706', '#0284C7', '#6366F1', '#E11D48', '#0D9488'];
const COLORS_CLASIF = ['#059669', '#0284C7', '#E11D48', '#6366F1'];
const COLORS_TYPE = ['#0284C7', '#E11D48'];
const COLORS_PROD = ['#D97706', '#059669', '#6366F1', '#E11D48'];

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
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Panel de Control Gerencial
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Business Intelligence
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Resumen financiero y métricas operativas de La Leonora.</p>
        </div>
        
        {/* Date Filters */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-2">
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-slate-300 font-bold">|</span>
          <div className="flex items-center gap-2 px-2">
            <input 
              type="date" 
              className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={handleFilter} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-all">
            <Filter className="w-3.5 h-3.5" />
          </button>
          {(startDate || endDate) && (
            <button onClick={handleClearFilter} className="text-rose-600 hover:text-rose-700 px-2 text-xs font-bold transition-all">
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
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Ingresos Totales</p>
              <p className="text-2xl font-black text-slate-900">${Math.round(stats?.total_ingresos || 0).toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Costos Totales</p>
              <p className="text-2xl font-black text-slate-900">${Math.round(stats?.total_egresos || 0).toLocaleString()}</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-rose-700 group-hover:bg-rose-700 group-hover:text-white transition-colors duration-300">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Utilidad Neta</p>
              <p className="text-2xl font-black text-emerald-700">${Math.round(stats?.utilidad_neta || 0).toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card-agro-premium group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Margen Neta (%)</p>
              <p className="text-2xl font-black text-slate-900">{stats?.margen_ganancia?.toFixed(1)}%</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white transition-colors duration-300">
              <Percent className="w-5 h-5" />
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
                <span className="font-bold text-emerald-600">${Math.round(stats?.pyg_consolidado?.ingresos_operacionales || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 pl-4">
                <span className="text-gray-500">(-) Costos de Producción</span>
                <span className="font-semibold text-rose-500">${Math.round(stats?.pyg_consolidado?.costos_produccion || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200 bg-gray-50/50 rounded-lg px-2">
                <span className="text-gray-800 font-bold">(=) Utilidad Bruta</span>
                <span className="font-bold text-blue-600">${Math.round(stats?.pyg_consolidado?.utilidad_bruta || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos Administrativos</span>
                <span className="font-semibold text-rose-500 text-sm">${Math.round(stats?.pyg_consolidado?.gastos_administrativos || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos de Ventas</span>
                <span className="font-semibold text-rose-500 text-sm">${Math.round(stats?.pyg_consolidado?.gastos_ventas || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200 bg-gray-50/50 rounded-lg px-2">
                <span className="text-gray-800 font-bold">(=) Utilidad Operacional</span>
                <span className="font-bold text-blue-600">${Math.round(stats?.pyg_consolidado?.utilidad_operacional || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 pl-4">
                <span className="text-gray-500 text-sm">(-) Gastos Financieros</span>
                <span className="font-semibold text-rose-500 text-sm">${Math.round(stats?.pyg_consolidado?.gastos_financieros || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 flex justify-between items-center">
            <span className="text-lg font-black text-green-900 uppercase tracking-wider">Utilidad Neta</span>
            <span className="text-2xl font-black text-green-700">${Math.round(stats?.pyg_consolidado?.utilidad_neta || 0).toLocaleString()}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Costos por Rubro Contable (P&G) */}
        <div className="card-agro-premium flex flex-col h-[320px]">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-800">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Estructura por Rubro Contable (P&G)
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.costos_por_clasificacion}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={75}
                  paddingAngle={5}
                  dataKey="value" nameKey="name"
                >
                  {stats?.costos_por_clasificacion?.map((entry: any, index: number) => (
                    <Cell key={`cell-c-${index}`} fill={COLORS_CLASIF[index % COLORS_CLASIF.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`$${Math.round(Number(val) || 0).toLocaleString()}`, 'Monto']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Costos por Categoria */}
        <div className="card-agro-premium flex flex-col h-[320px]">
           <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-gray-800">
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
            Distribución por Categoría Operativa
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.costos_por_categoria}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={75}
                  paddingAngle={5}
                  dataKey="value" nameKey="category"
                >
                  {stats?.costos_por_categoria?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS_CAT[index % COLORS_CAT.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`$${Math.round(Number(val) || 0).toLocaleString()}`, 'Monto']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rentabilidad por Producto */}
        <div className="card-agro-premium h-[320px] flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Activity className="w-5 h-5 text-amber-500" />
            Rentabilidad por Producto
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.rentabilidad_productos} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 600, fill: '#374151', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="egresos" name="Egresos" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Lot Performance Table */}
      <div className="card-agro-premium">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Desempeño Operativo por Lote</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] pr-2">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
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
                    <td className="py-4 px-4 text-emerald-600 font-semibold text-right">${Math.round(lote.ingresos || 0).toLocaleString()}</td>
                    <td className="py-4 px-4 text-rose-600 font-semibold text-right">${Math.round(lote.egresos || 0).toLocaleString()}</td>
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

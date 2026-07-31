'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getConfiguracion } from '@/lib/api';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  TrendingDown, 
  Settings,
  Leaf
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Lotes', href: '/lotes', icon: Sprout },
  { name: 'Ingresos', href: '/ingresos', icon: TrendingUp },
  { name: 'Egresos', href: '/egresos', icon: TrendingDown },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [farmName, setFarmName] = useState('...'); // Loading state

  useEffect(() => {
    getConfiguracion()
      .then(res => setFarmName(res.nombre_finca))
      .catch(err => setFarmName('La Leonora')); // Fallback on error
  }, []);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-2xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="bg-emerald-600 p-2.5 rounded-xl shadow-md shadow-emerald-900/40 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight block leading-tight">{farmName}</span>
          <span className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">Gestión Agrícola</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group font-semibold text-sm",
                isActive 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              )}
            >
              <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/60">
        <div className="bg-slate-850 bg-slate-800/50 p-4 rounded-xl border border-slate-700/40">
          <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
             Sistema en Línea
          </p>
          <p className="text-xs font-bold text-slate-200">Base Neon PostgreSQL</p>
        </div>
      </div>
    </aside>
  );
}

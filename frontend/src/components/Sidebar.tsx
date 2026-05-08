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
    <aside className="w-64 glass-dark h-screen fixed left-0 top-0 flex flex-col z-50 shadow-2xl shadow-emerald-900/20">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">{farmName}</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group duration-300 font-medium",
                isActive 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 translate-x-1" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "group-hover:text-emerald-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-inner">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Estado Operativo
          </p>
          <p className="text-sm font-bold text-white">Sincronización Activa</p>
        </div>
      </div>
    </aside>
  );
}

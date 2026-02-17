"use client";

import React from "react";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    { label: "Usuarios Totales", value: "1,284", change: "+12%", trend: "up", icon: Users },
    { label: "Turnos Hoy", value: "42", change: "+5%", trend: "up", icon: Calendar },
    { label: "Ingresos Mes", value: "$12,450", change: "-2%", trend: "down", icon: DollarSign },
    { label: "Tasa Conversión", value: "64%", change: "+8%", trend: "up", icon: TrendingUp },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 space-y-10 animate-in fade-in duration-500 custom-scrollbar">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Panel Principal</h1>
          <p className="text-text-secondary font-medium italic text-lg">Bienvenido de nuevo, aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-border text-white hover:bg-white/5 rounded-xl px-6 h-12 font-bold">
            Descargar Reporte
          </Button>
          <Button className="bg-accent text-base hover:bg-accent/90 rounded-xl px-8 h-12 font-black shadow-lg shadow-accent/20">
            Nuevo Turno
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#262D35] border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-xl bg-base border border-border group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-black ${stat.trend === "up" ? "text-accent" : "text-red-400"}`}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
            </div>
            <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight">Actividad Reciente</h2>
            <Button variant="link" className="text-accent font-bold hover:no-underline">Ver todo</Button>
          </div>
          <div className="bg-[#262D35] border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary">
                      {i}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-accent transition-colors">Nuevo registro de servicio</p>
                      <p className="text-sm text-text-secondary">Cliente: Juan Pérez • ID: #ORD-{1000 + i}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-white">$45.00</p>
                      <p className="text-[10px] text-accent uppercase font-black tracking-widest">Completado</p>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-xl">
                      <MoreVertical className="h-5 w-5 text-text-secondary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar/Schedule Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight">Próximos Turnos</h2>
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <Card className="bg-primary border-none rounded-xl p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">15 Feb</p>
                    <p className="text-xl font-black">09:00</p>
                    <div className="w-0.5 flex-1 bg-white/20 my-2" />
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors">
                    <p className="font-bold text-sm">Corte de Cabello</p>
                    <p className="text-xs opacity-60">Barbería Central • Luis A.</p>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl h-12 font-black">
                Gestionar Calendario
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { auth } from "@/utils/auth-client";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui";
import { SidebarNavItem } from "@/components/dashboard/sidebar-nav-item";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, canAccessDashboard, loading } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-accent"></div>
      </div>
    );
  }

  if (!canAccessDashboard) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-base text-center p-6">
        <h1 className="text-4xl font-black text-white mb-4">Acceso Denegado</h1>
        <p className="text-xl text-text-secondary mb-8">Lo sentimos, no tienes los permisos necesarios para acceder a este panel.</p>
        
        <Button onClick={() => auth.logout()} className="bg-primary hover:bg-primary/90">
          Volver al inicio
        </Button>
      </div>
    );
  }

  interface MenuItem {
    icon: typeof LayoutDashboard;
    label: string;
    href?: string;
    subItems?: { label: string; href: string }[];
  }

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Turnos", href: "/dashboard/turnos" },
    { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
    { 
      icon: Settings, 
      label: "Configuración", 
      subItems: [
        { label: "Servicios", href: "/dashboard/configuracion/servicios" },
        { label: "Espacios", href: "/dashboard/configuracion/espacios" },
      ] 
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-base text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-[#262D35] border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-base">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Turnesa</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarNavItem 
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                subItems={item.subItems}
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-border">
            <button 
              onClick={() => auth.logout()}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-bold text-sm tracking-wide">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 bg-[#262D35]/50 border-b border-border backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-accent" />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-border px-4 py-2 rounded-2xl w-96">
              <Search className="h-4 w-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-xl relative">
              <Bell className="h-6 w-6 text-text-secondary" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-[#262D35]" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black tracking-tight">Admin User</p>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{role}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

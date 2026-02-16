"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  DollarSign, 
  FileText, 
  User,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { auth } from "@/utils/auth-client";

export default function NuevoServicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "duration" || id === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al crear el servicio");
      }

      router.push("/dashboard/configuracion/servicios");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="rounded-xl p-2 h-auto hover:bg-white/5">
            <Link href="/dashboard/configuracion/servicios">
              <ArrowLeft className="h-6 w-6 text-accent" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Nuevo Servicio</h1>
            <p className="text-text-secondary text-sm font-medium">Configura un nuevo tipo de atención.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                  Nombre del Servicio
                </Label>
                <div className="relative group">
                  <Sparkles className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Corte Estándar, Sesión de Terapia..." 
                    className="pl-14"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                  Descripción
                </Label>
                <div className="relative group">
                  <FileText className="absolute top-5 left-5 h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <textarea 
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#262D35] border-2 border-[#3F4652] rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-[#94A3B8]"
                    placeholder="Describe en qué consiste este servicio..."
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Profesional Asignado
            </h3>
            <p className="text-sm text-text-secondary mb-6 italic">
              Próximamente: Podrás vincular este servicio a profesionales específicos.
            </p>
            <div className="p-4 bg-base rounded-2xl border border-border text-center opacity-50">
              <span className="text-xs font-bold uppercase tracking-tighter">Selección deshabilitada temporalmente</span>
            </div>
          </Card>
        </div>

        {/* Sidebar Info (Price/Time) */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6 bg-primary/5 border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                Duración (minutos)
              </Label>
              <div className="relative group">
                <Clock className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                <Input 
                  id="duration" 
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60" 
                  className="pl-14"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                Precio Sugerido
              </Label>
              <div className="relative group">
                <DollarSign className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                <Input 
                  id="price" 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00" 
                  className="pl-14"
                  required
                />
              </div>
            </div>

            <hr className="border-border" />

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-base hover:bg-accent/90 h-14 rounded-2xl font-black shadow-lg shadow-accent/20"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Guardando..." : "Guardar Servicio"}
            </Button>
            
            <Button asChild variant="ghost" className="w-full text-text-secondary hover:text-white">
              <Link href="/dashboard/configuracion/servicios">Cancelar</Link>
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}

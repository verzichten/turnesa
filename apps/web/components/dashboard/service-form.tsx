"use client";

import React, { useState } from "react";
import { 
  Clock, 
  DollarSign, 
  FileText, 
  Sparkles,
  User,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export function ServiceForm({ initialData, onSubmit, loading, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialData || {
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  // Helper to format number with dots as thousands separators
  const formatNumber = (val: number | string) => {
    if (val === "" || val === undefined) return "";
    const num = val.toString().replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === "price") {
      // Remove all non-digits to get raw number
      const rawValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [id]: rawValue === "" ? "" as any : Number(rawValue) }));
      return;
    }

    if (id === "duration") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [id]: "" as any }));
        return;
      }
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => ({ ...prev, [id]: numValue }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if ((id === "duration" || id === "price") && (value === "0" || value === "30" || value === "")) {
      e.target.select();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      duration: Number(formData.duration) || 0,
      price: Number(formData.price) || 0,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden border-border bg-[#262D35]/30 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side: Basic Info */}
          <div className="p-8 lg:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-accent rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Información Principal</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                  Nombre del Servicio
                </Label>
                <div className="relative group">
                  <Sparkles className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Corte Estándar, Sesión de Terapia..." 
                    className="pl-14 h-12 text-base bg-base/50 border-border focus:border-accent transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                  Descripción Detallada
                </Label>
                <div className="relative group">
                  <FileText className="absolute top-6 left-5 h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                  <textarea 
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-base/50 border-2 border-border rounded-xl pl-14 pr-6 py-4 text-base text-white focus:outline-none focus:border-accent transition-all placeholder:text-text-secondary/50 resize-none"
                    placeholder="Describe en qué consiste este servicio..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Configuration */}
          <div className="p-8 lg:p-10 space-y-10 bg-white/5">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Configuración y Costos</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                    Duración (min)
                  </Label>
                  <div className="relative group">
                    <Clock className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="duration" 
                      type="number"
                      value={formData.duration}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="60" 
                      className="pl-14 h-12 text-base bg-base/50 border-border focus:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">
                    Precio Sugerido
                  </Label>
                  <div className="relative group">
                    <DollarSign className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="price" 
                      type="text"
                      value={formatNumber(formData.price)}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="0" 
                      className="pl-14 h-12 text-base bg-base/50 border-border focus:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#262D35]/50 rounded-2xl border border-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <div className="px-2 py-1 bg-primary/10 rounded-md text-[8px] font-black text-primary uppercase tracking-tighter">Próximamente</div>
                </div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-3 text-white">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Profesional Asignado
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Próximamente podrás vincular este servicio a profesionales específicos.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border/50">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onCancel}
                  className="flex-1 text-text-secondary hover:text-white font-bold"
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-accent text-base hover:bg-accent/90 h-12 rounded-xl font-black shadow-lg shadow-accent/20 transition-all active:scale-95"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? "Guardando..." : "Guardar Servicio"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

"use client";

import * as React from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  Info,
  History,
  Layers,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: { name: string };
  updatedBy?: { name: string };
}

interface ViewServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewServiceModal({ service, isOpen, onClose }: ViewServiceModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-base border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="flex items-center justify-between px-8 py-6 bg-[#262D35] border-b border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Layers className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white">Detalles del Servicio</h2>
              <p className="text-text-secondary text-sm font-medium">Información técnica y trazabilidad.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-text-secondary hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Main Info Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[#262D35]/50 border border-border rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-text-secondary text-[10px] font-black uppercase tracking-widest">
                <Clock className="h-3 w-3 text-primary" />
                Duración
              </div>
              <p className="text-xl font-black text-white">{service.duration} minutos</p>
            </div>
            <div className="p-5 bg-[#262D35]/50 border border-border rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-text-secondary text-[10px] font-black uppercase tracking-widest">
                <DollarSign className="h-3 w-3 text-accent" />
                Precio
              </div>
              <p className="text-xl font-black text-white">${formatPrice(service.price)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-text-secondary text-[10px] font-black uppercase tracking-widest ml-1">
              <FileText className="h-3 w-3" />
              Descripción
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-border">
              <p className="text-white leading-relaxed italic">
                {service.description || "Este servicio no cuenta con una descripción detallada."}
              </p>
            </div>
          </div>

          {/* Traceability / Metadata */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
              <History className="h-4 w-4" />
              Trazabilidad del Registro
            </h3>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1 p-4 bg-base rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-sm font-bold text-text-secondary">Fecha de Creación</span>
                  </div>
                  <span className="text-sm font-black text-white">{formatDate(service.createdAt)}</span>
                </div>
                {service.createdBy && (
                  <p className="text-[10px] text-text-secondary/60 mt-1 ml-5">
                    Creado por: <span className="text-accent font-bold">{service.createdBy.name}</span>
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-1 p-4 bg-base rounded-xl border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-text-secondary">Última Modificación</span>
                  </div>
                  <span className="text-sm font-black text-white">{formatDate(service.updatedAt)}</span>
                </div>
                {service.updatedBy && (
                  <p className="text-[10px] text-text-secondary/60 mt-1 ml-5">
                    Modificado por: <span className="text-primary font-bold">{service.updatedBy.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#262D35] border-t border-border flex justify-end">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90 h-11 px-8">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}

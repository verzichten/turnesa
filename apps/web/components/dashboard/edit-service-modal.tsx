"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { ServiceForm } from "./service-form";
import { auth } from "@/utils/auth-client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface EditServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditServiceModal({ service, isOpen, onClose, onSuccess }: EditServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const token = auth.getToken();
      if (!token) throw new Error("No estás autenticado");

      const response = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al actualizar el servicio");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-base border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="flex items-center justify-between px-8 py-6 bg-[#262D35] border-b border-border">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white">Editar Servicio</h2>
            <p className="text-text-secondary text-sm font-medium">Modifica los detalles del servicio seleccionado.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-text-secondary hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
            </div>
          )}

          <ServiceForm 
            initialData={{
              name: service.name,
              description: service.description || "",
              duration: service.duration,
              price: service.price,
            }}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

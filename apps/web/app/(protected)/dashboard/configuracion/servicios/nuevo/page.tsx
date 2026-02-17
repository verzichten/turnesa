"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/utils/auth-client";
import { ServiceForm } from "@/components/dashboard/service-form";

export default function NuevoServicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
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
    <div className="flex flex-col h-full bg-base overflow-hidden">
      {/* Page Header */}
      <header className="flex-none bg-[#262D35]/50 border-b border-border px-8 py-6 backdrop-blur-xl z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Button asChild variant="ghost" className="rounded-xl p-3 h-auto hover:bg-white/5 border border-border group transition-all">
              <Link href="/dashboard/configuracion/servicios">
                <ArrowLeft className="h-6 w-6 text-accent group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">Nuevo Servicio</h1>
              <p className="text-text-secondary text-sm font-medium">Configura un nuevo tipo de atención.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-red-500 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="hover:bg-red-500/10 p-1 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <ServiceForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              onCancel={() => router.push("/dashboard/configuracion/servicios")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

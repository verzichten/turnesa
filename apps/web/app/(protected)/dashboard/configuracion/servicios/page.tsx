"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Settings2, 
  Layers,
  Clock,
  DollarSign,
  MoreVertical,
  Edit,
  Trash,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";
import { auth } from "@/utils/auth-client";
import { EditServiceModal } from "@/components/dashboard/edit-service-modal";
import { ViewServiceModal } from "@/components/dashboard/view-service-modal";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown";

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
  professional?: {
    id: string;
    name: string;
  };
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const token = auth.getToken();
      if (!token) throw new Error("No estás autenticado");

      const response = await fetch("/api/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar los servicios");

      const result = await response.json();
      setServices(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const token = auth.getToken();
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el servicio");
      }

      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ocurrió un error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 custom-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Servicios</h1>
          <p className="text-text-secondary font-medium italic text-lg">
            Administra los servicios que ofreces a tus clientes.
          </p>
        </div>
        <Button asChild className="bg-accent text-base hover:bg-accent/90 rounded-xl px-8 h-12 font-black shadow-lg shadow-accent/20">
          <Link href="/dashboard/configuracion/servicios/nuevo">
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Servicio
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o descripción..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#262D35] border-2 border-border rounded-xl pl-14 pr-6 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white"
          />
        </div>
        <Button variant="outline" className="rounded-xl border-border h-auto py-3">
          <Settings2 className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Services List / Table */}
      {filteredServices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center bg-[#262D35] border-dashed border-2 border-border rounded-2xl">
          <div className="h-24 w-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Layers className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">
            {searchQuery ? "No se encontraron resultados" : "No hay servicios registrados"}
          </h2>
          <p className="text-text-secondary max-w-xs mx-auto mb-10">
            {searchQuery 
              ? `No pudimos encontrar nada que coincida con "${searchQuery}".`
              : "Comienza por crear tu primer servicio para que tus clientes puedan empezar a agendar turnos."
            }
          </p>
          {!searchQuery && (
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl px-10 h-12 font-black">
              <Link href="/dashboard/configuracion/servicios/nuevo">
                Crear mi primer servicio
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className={cn(
              "p-6 bg-[#262D35] border-border hover:border-primary/50 transition-all group",
              deletingId === service.id && "opacity-50 pointer-events-none"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
                
                <DropdownMenu 
                  trigger={
                    <Button variant="ghost" size="icon" className="rounded-full text-text-secondary hover:text-white hover:bg-white/5">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  }
                >
                  <DropdownItem onClick={() => setViewingService(service)}>
                    <Info className="h-4 w-4 text-accent" />
                    Ver Detalles
                  </DropdownItem>
                  <DropdownItem onClick={() => setEditingService(service)}>
                    <Edit className="h-4 w-4 text-primary" />
                    Editar
                  </DropdownItem>
                  <hr className="border-border my-1 mx-2" />
                  <DropdownItem 
                    variant="danger" 
                    onClick={() => handleDelete(service.id, service.name)}
                  >
                    <Trash className="h-4 w-4" />
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
              </div>
              
              <h3 className="text-xl font-black mb-2 line-clamp-1">{service.name}</h3>
              <p className="text-text-secondary text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                {service.description || "Sin descripción disponible."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-xs font-bold text-text-secondary uppercase tracking-tighter">
                    <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center text-xs font-bold text-text-secondary uppercase tracking-tighter">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5 text-accent" />
                    {formatPrice(service.price)}
                  </div>
                </div>
                {/* Manual buttons removed as they are now in the dropdown */}
              </div>
            </Card>
          ))}
        </div>
      )}

      {editingService && (
        <EditServiceModal 
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={fetchServices}
        />
      )}

      {viewingService && (
        <ViewServiceModal
          service={viewingService}
          isOpen={!!viewingService}
          onClose={() => setViewingService(null)}
        />
      )}
    </div>
  );
}

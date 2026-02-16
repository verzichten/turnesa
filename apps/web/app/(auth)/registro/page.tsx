"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, Label } from "@/components/ui";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar usuario");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base p-6 text-white">
        <div className="w-full max-w-lg space-y-10 rounded-[3rem] border-4 border-border bg-[#262D35] p-12 text-center shadow-2xl">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-accent text-base shadow-2xl">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter">
              ¡Éxito total!
            </h1>
            <p className="text-2xl text-text-secondary leading-relaxed font-medium">
              Ya eres parte de Turnesa. Tu viaje comienza ahora.
            </p>
          </div>
          <Button asChild size="lg" className="w-full rounded-[2rem] bg-primary hover:bg-primary/90">
            <Link
              href="/iniciar-sesion"
              className="flex items-center justify-center w-full h-full"
            >
              <span>Entrar a mi panel</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#2F3640] text-white">
      {/* Left side: Content/Marketing (Scrollable) */}
      <div className="relative hidden h-full w-1/2 flex-col bg-[#262D35] p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(108,92,231,0.2)_0%,rgba(47,54,64,1)_100%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#55E6C1] text-[#2F3640] shadow-2xl">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-3xl font-black tracking-tighter">
              Turnesa
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-6xl font-black leading-[1] tracking-tighter">
              El poder de la <br />
              <span className="text-[#55E6C1]">simplicidad.</span>
            </h2>
            <p className="max-w-md text-xl leading-relaxed text-[#D1D5DB] font-medium">
              La plataforma multitenant más intuitiva y potente del mercado.
            </p>
          </div>

          <div className="grid gap-8">
            <div className="flex items-center gap-5 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/5 border-2 border-[#3F4652] shadow-2xl transition-transform group-hover:scale-110">
                <ShieldCheck className="h-7 w-7 text-[#55E6C1]" />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-[10px]">
                  Aislamiento Total
                </h3>
                <p className="text-[#D1D5DB] text-base">
                  Seguridad grado bancario para cada tenant.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/5 border-2 border-[#3F4652] shadow-2xl transition-transform group-hover:scale-110">
                <Zap className="h-7 w-7 text-[#55E6C1]" />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-[10px]">
                  Rendimiento Extremo
                </h3>
                <p className="text-[#D1D5DB] text-base">
                  Arquitectura optimizada para la velocidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-black uppercase tracking-[0.3em] text-[#D1D5DB]">
          <span>TURNESA © 2026</span>
          <div className="flex gap-10">
            <Link
              href="/privacidad"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="hover:text-white transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex h-full w-full flex-col p-8 lg:w-1/2 xl:p-12 bg-[#2F3640] overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">
        <div className="mx-auto w-full max-w-xl space-y-8 my-auto">
          <div className="space-y-2 lg:text-left text-center">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Únete hoy
            </h1>
            <p className="text-xl text-[#D1D5DB] font-medium italic">
              Empieza a escalar tu negocio en segundos.
            </p>
          </div>

          {error && (
            <div className="rounded-[2.5rem] border-4 border-red-500/50 bg-red-500/10 p-6 text-sm text-red-400 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                <p className="font-bold text-lg">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="ml-3 text-[9px] font-black uppercase tracking-widest text-[#D1D5DB]"
                >
                  Nombre Completo
                </Label>
                <div className="relative group">
                  <User className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-[#D1D5DB] group-focus-within:text-[#55E6C1] transition-colors" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-14 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="ml-3 text-[9px] font-black uppercase tracking-widest text-[#D1D5DB]"
                >
                  Email Corporativo
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-[#D1D5DB] group-focus-within:text-[#55E6C1] transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hola@empresa.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-14 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="ml-3 text-[9px] font-black uppercase tracking-widest text-[#D1D5DB]"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-[#D1D5DB] group-focus-within:text-[#55E6C1] transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-14 rounded-2xl"
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="group rounded-2xl px-12 w-full sm:w-auto bg-[#6C5CE7] text-white hover:bg-[#6C5CE7]/90"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creando...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-3">
                    Empezar ahora
                    <UserPlus className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>

            <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-[#D1D5DB] leading-relaxed max-w-xs mx-auto">
              Al registrarte, aceptas los{" "}
              <Link
                href="/terminos"
                className="text-white underline"
              >
                Términos
              </Link>{" "}
              y la{" "}
              <Link
                href="/privacidad"
                className="text-white underline"
              >
                Privacidad
              </Link>
              .
            </p>
          </form>

          <div className="border-t border-[#3F4652] pt-8 text-center">
            <p className="text-[#D1D5DB] font-bold text-lg">
              ¿Ya estás dentro?{" "}
              <Button
                asChild
                variant="link"
                className="p-0 h-auto font-black text-[#55E6C1] hover:no-underline underline underline-offset-[12px] decoration-4"
              >
                <Link href="/iniciar-sesion">Inicia sesión</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

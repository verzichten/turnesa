"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, Label } from "@/components/ui";
import { LogIn, Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import { auth } from "@/utils/auth-client";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al iniciar sesión");
      }

      // The actual payload is inside the 'data' property due to NestJS interceptor
      const { access_token, user } = responseData.data;
      
      // Store session
      auth.setSession(access_token, user);

      window.location.href = "/dashboard";
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

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#2F3640] text-white">
      {/* Left side: Brand/Marketing */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#262D35] p-16 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,92,231,0.2)_0%,rgba(47,54,64,1)_100%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#55E6C1] text-[#2F3640] shadow-2xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <span className="text-4xl font-black tracking-tighter">
              Turnesa
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-7xl font-black leading-[1] tracking-tighter italic">
            El futuro <br />
            <span className="text-[#55E6C1] not-italic">es ahora.</span>
          </h2>
          <p className="max-w-md text-2xl leading-relaxed text-[#D1D5DB] font-medium">
            Gestiona servicios, equipos y clientes con la plataforma más
            avanzada del mercado.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm font-bold text-[#D1D5DB]">
          <span>© 2026 TURNESA.</span>
          <div className="flex gap-6">
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

      {/* Right side: Login Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 xl:p-24 bg-[#2F3640]">
        <div className="mx-auto w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Hola de nuevo
            </h1>
            <p className="text-xl text-[#D1D5DB] font-medium italic">
              Entra y sigue construyendo tu imperio.
            </p>
          </div>

          {error && (
            <div className="rounded-[2rem] border-2 border-red-500/50 bg-red-500/10 p-6 text-sm text-red-400 shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="ml-2 text-xs font-black uppercase tracking-widest text-[#D1D5DB]"
                >
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-[#D1D5DB] group-focus-within:text-[#55E6C1] transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@correo.com"
                    className="pl-14 h-15 rounded-[1.5rem]"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-black uppercase tracking-widest text-[#D1D5DB]"
                  >
                    Password
                  </Label>
                  <Link
                    href="/recuperar-password"
                    title="Recuperar contraseña"
                    className="text-[10px] font-black uppercase tracking-widest text-[#D1D5DB] hover:text-white transition-colors"
                  >
                    ¿Lo olvidaste?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-[#D1D5DB] group-focus-within:text-[#55E6C1] transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-14 h-15 rounded-[1.5rem]"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-[1.5rem] bg-[#6C5CE7] text-white hover:bg-[#6C5CE7]/90"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 ml-1 animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <LogIn className="h-5 w-5 ml-5" />
                  <span>Entrar ahora</span>
                </div>
              )}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-[#D1D5DB] font-bold text-lg">
              ¿No tienes cuenta?{" "}
              <Button
                asChild
                variant="link"
                className="p-0 h-auto font-black text-[#55E6C1] hover:no-underline underline underline-offset-8 decoration-2"
              >
                <Link href="/registro">Regístrate aquí</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, Trophy, Briefcase, Megaphone, Heart, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { SportioLogo } from "@/components/shared/sportio-logo";

const roles = [
  { id: "athlete", label: "Atleta", icon: Trophy, description: "Competir em torneios e ganhar GCoins" },
  { id: "organizer", label: "Organizador", icon: Briefcase, description: "Criar e gerenciar torneios" },
  { id: "brand", label: "Marca", icon: Megaphone, description: "Patrocinar e impulsionar sua marca" },
  { id: "fan", label: "Fa", icon: Heart, description: "Acompanhar e torcer" },
  { id: "bettor", label: "Palpiteiro", icon: Target, description: "Fazer palpites e ganhar GCoins" },
  { id: "referee", label: "Arbitro", icon: Shield, description: "Validar partidas e resultados" },
];

type RoleId = "athlete" | "organizer" | "brand" | "fan" | "bettor" | "referee";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const registerMutation = trpc.user.register.useMutation();

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      await registerMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        roles: selectedRoles as RoleId[],
      });

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("Conta criada! Faca login para continuar.");
        router.push("/login");
      } else {
        toast.success("Conta criada com sucesso!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar conta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden mb-8">
        <SportioLogo className="h-10" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">Crie sua conta</h2>
      <p className="text-slate-500 mb-8">
        {step === 1 ? "Preencha seus dados para comecar" : "Escolha seu perfil na plataforma"}
      </p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
            step >= 1
              ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/20"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          )}>1</div>
          <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-500 ease-out", step >= 2 ? "w-full bg-gradient-to-r from-blue-500 to-blue-600" : "w-0")} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
            step >= 2
              ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/20"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          )}>2</div>
          <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-500 ease-out", step >= 2 ? "w-full bg-gradient-to-r from-blue-500 to-blue-600" : "w-0")} />
          </div>
        </div>
      </div>

      {step === 1 ? (
        <>
          {/* Google Signup */}
          <Button variant="outline" size="lg" className="w-full mb-6" onClick={handleGoogleSignIn}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Cadastrar com Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">ou cadastre com email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              icon={<User className="w-4 h-4" />}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="Minimo 8 caracteres"
                icon={<Lock className="w-4 h-4" />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Continuar
            </Button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 mb-6 sm:gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRoles.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center sm:gap-2 sm:p-4",
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10 ring-1 ring-blue-600/20"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600"
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs font-medium sm:text-sm">{role.label}</span>
                  <span className="text-[10px] leading-tight opacity-70 sm:text-xs">{role.description}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 mb-4 text-center">
            Voce pode ter multiplos perfis. Selecione todos que se aplicam.
          </p>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="flex-1"
              disabled={selectedRoles.length === 0}
            >
              Criar conta
            </Button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Ja tem conta?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Fazer login
        </Link>
      </p>
    </div>
  );
}

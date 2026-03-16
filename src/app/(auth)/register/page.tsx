"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, Trophy, Briefcase, Megaphone, Shield, Dumbbell, Apple, Camera, Building2 } from "lucide-react";
import { SportioLogo } from "@/components/shared/sportio-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

const roles = [
  { id: "athlete", label: "Atleta", icon: Trophy, description: "Competir em torneios e ganhar GCoins", primary: true },
  { id: "organizer", label: "Organizador", icon: Briefcase, description: "Criar e gerenciar torneios", primary: true },
  { id: "brand", label: "Marca", icon: Megaphone, description: "Patrocinar e impulsionar sua marca", primary: true },
  { id: "referee", label: "Árbitro", icon: Shield, description: "Validar partidas e resultados", primary: false },
  { id: "trainer", label: "Treinador", icon: Dumbbell, description: "Treinar e orientar atletas", primary: false },
  { id: "nutritionist", label: "Nutricionista", icon: Apple, description: "Nutrição esportiva e dietas", primary: false },
  { id: "photographer", label: "Fotógrafo", icon: Camera, description: "Registrar momentos esportivos", primary: false },
  { id: "arena_owner", label: "Dono de Arena", icon: Building2, description: "Gerenciar espaços esportivos", primary: false },
];

type RoleId = "athlete" | "organizer" | "brand" | "referee" | "trainer" | "nutritionist" | "photographer" | "arena_owner";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personaParam = searchParams.get("persona");
  const validRoleIds = roles.map((r) => r.id);
  const initialRoles = personaParam && validRoleIds.includes(personaParam) ? [personaParam] : [];

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);
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
        router.push("/social");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar conta";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden mb-8">
        <SportioLogo className="h-10" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">Crie sua conta</h2>
      <p className="text-slate-500 mb-8">
        {step === 1 ? "Preencha seus dados para começar" : "Escolha seu perfil na plataforma"}
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
                placeholder="Mínimo 8 caracteres"
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
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-4 text-center font-medium">
            Todos os usuários podem acompanhar torneios, dar palpites e interagir na comunidade automaticamente.
          </p>

          <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Perfis principais</p>
          <div className="grid grid-cols-3 gap-2 mb-4 sm:gap-3">
            {roles.filter(r => r.primary).map((role) => {
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

          <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Outros perfis</p>
          <div className="grid grid-cols-2 gap-2 mb-4 sm:gap-3 sm:grid-cols-3">
            {roles.filter(r => !r.primary).map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRoles.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center sm:gap-2 sm:p-3",
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10 ring-1 ring-blue-600/20"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600"
                  )}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] font-medium sm:text-xs">{role.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 mb-4 text-center">
            Selecione um ou mais perfis. Você pode alterar depois nas configurações.
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
            >
              Criar conta
            </Button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Fazer login
        </Link>
      </p>
    </div>
  );
}

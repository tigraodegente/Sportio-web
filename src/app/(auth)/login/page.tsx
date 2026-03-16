"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
// Google OAuth temporarily disabled - client needs reconfiguration
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { SportioLogo } from "@/components/shared/sportio-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/social");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao fazer login. Tente novamente.");
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

      <h2 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h2>
      <p className="text-slate-500 mb-8">Entre na sua conta para continuar</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Sua senha"
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-slate-600">Lembrar-me</span>
          </label>
          <button
            type="button"
            onClick={() => toast.info("Funcionalidade em breve. Use a opcao 'Alterar Senha' nas Configuracoes.")}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full font-bold tracking-wide">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Não tem conta?{" "}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Cadastre-se grátis
        </Link>
      </p>

      {/* Trust badges */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Dados protegidos
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>SSL 256-bit</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>100% seguro</span>
      </div>
    </div>
  );
}

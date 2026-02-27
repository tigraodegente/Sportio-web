"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, LogOut, Camera, Settings, AlertTriangle, Instagram, Twitter, Youtube, Check, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/25">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuracoes</h1>
          <p className="text-sm text-slate-500">Gerencie sua conta e preferencias</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "profile", label: "Perfil", icon: <User className="w-4 h-4" /> },
          { id: "notifications", label: "Notificacoes", icon: <Bell className="w-4 h-4" /> },
          { id: "privacy", label: "Privacidade", icon: <Shield className="w-4 h-4" /> },
          { id: "payment", label: "Pagamento", icon: <CreditCard className="w-4 h-4" /> },
        ]}
      >
        {(tab) => (
          <>
            {tab === "profile" && (
              <div className="space-y-6">
                {/* Profile Card with emerald accent */}
                <Card className="border-l-4 border-l-emerald-500 overflow-visible">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    Informacoes Pessoais
                  </CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    {/* Avatar with camera overlay */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-600 text-2xl font-bold ring-4 ring-emerald-100 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-emerald-200">
                          LM
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/30 ring-2 ring-white">
                          <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="shadow-sm">
                          <Camera className="w-3.5 h-3.5" />
                          Alterar foto
                        </Button>
                        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG. Max 5MB</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Nome" defaultValue="Lucas Mendes" />
                      <Input label="Email" type="email" defaultValue="lucas@email.com" disabled />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Telefone" defaultValue="(11) 99999-9999" />
                      <Select
                        label="Cidade"
                        options={[
                          { value: "sp", label: "Sao Paulo, SP" },
                          { value: "rj", label: "Rio de Janeiro, RJ" },
                          { value: "bh", label: "Belo Horizonte, MG" },
                        ]}
                        defaultValue="sp"
                      />
                    </div>
                    <Textarea label="Bio" defaultValue="Atleta de Beach Tennis e CrossFit." rows={3} />
                  </CardContent>
                </Card>

                {/* Social Media Card with blue accent */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Redes Sociais
                  </CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    {/* Instagram */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="Instagram" placeholder="@seuusuario" defaultValue="lucasmendes" />
                      </div>
                    </div>
                    {/* Twitter */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Twitter className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="Twitter" placeholder="@seuusuario" defaultValue="lucasmendes" />
                      </div>
                    </div>
                    {/* YouTube */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Youtube className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="YouTube" placeholder="URL do canal" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button with success animation */}
                <div className="flex justify-end">
                  <Button
                    loading={loading}
                    onClick={handleSave}
                    className={cn(
                      "min-w-[180px] transition-all duration-300",
                      saved && "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30"
                    )}
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Salvo com Sucesso!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Alteracoes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <Card className="border-l-4 border-l-blue-500">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  Preferencias de Notificacao
                </CardTitle>
                <CardContent className="mt-4 space-y-1">
                  {[
                    { label: "Torneios", desc: "Novos torneios, inscricoes e resultados", defaultOn: true },
                    { label: "Partidas", desc: "Agenda, placar ao vivo e resultados", defaultOn: true },
                    { label: "GCoins", desc: "Transacoes e saldo", defaultOn: true },
                    { label: "Social", desc: "Novos seguidores, curtidas e comentarios", defaultOn: true },
                    { label: "Chat", desc: "Novas mensagens", defaultOn: true },
                    { label: "Palpites", desc: "Resultados dos palpites", defaultOn: true },
                    { label: "Marketing", desc: "Novidades e ofertas da plataforma", defaultOn: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultOn} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-emerald-500 transition-all duration-300"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {tab === "privacy" && (
              <Card className="border-l-4 border-l-purple-500">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Privacidade e Seguranca
                </CardTitle>
                <CardContent className="mt-4 space-y-1">
                  {[
                    { label: "Perfil publico", desc: "Permitir que outros vejam seu perfil", defaultOn: true },
                    { label: "Mostrar resultados", desc: "Exibir historico de torneios", defaultOn: true },
                    { label: "Mostrar GCoins", desc: "Exibir saldo de GCoins no perfil", defaultOn: true },
                    { label: "Permitir mensagens", desc: "Receber mensagens de qualquer usuario", defaultOn: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultOn} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-emerald-500 transition-all duration-300"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 mt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Shield className="w-3.5 h-3.5" />
                      Alterar Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {tab === "payment" && (
              <div className="space-y-6">
                <Card className="border-l-4 border-l-amber-500">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    Chave PIX
                  </CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <Input label="Chave PIX para saques" placeholder="CPF, email, telefone ou chave aleatoria" />
                    <Button variant="outline" size="sm" className="shadow-sm">
                      <Save className="w-3.5 h-3.5" />
                      Salvar Chave PIX
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    Historico de Pagamentos
                  </CardTitle>
                  <CardContent className="mt-4">
                    <div className="flex flex-col items-center py-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                        <CreditCard className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">Nenhum pagamento realizado ainda.</p>
                      <p className="text-xs text-slate-400 mt-1">Seus pagamentos aparecerao aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Danger Zone - Red gradient border + warning icon */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50/50 via-white to-white border-l-4 border-l-red-500">
        <CardTitle className="text-red-600 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          Zona de Perigo
        </CardTitle>
        <CardContent className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Sair da conta</p>
            <p className="text-xs text-slate-500 mt-0.5">Voce sera desconectado de todos os dispositivos</p>
          </div>
          <Button variant="danger" size="sm" className="shadow-sm shadow-red-500/20">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

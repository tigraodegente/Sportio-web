"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Smartphone, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuracoes</h1>
        <p className="text-slate-500">Gerencie sua conta e preferencias</p>
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
                <Card>
                  <CardTitle>Informacoes Pessoais</CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                        LM
                      </div>
                      <Button variant="outline" size="sm">Alterar foto</Button>
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

                <Card>
                  <CardTitle>Redes Sociais</CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <Input label="Instagram" placeholder="@seuusuario" defaultValue="lucasmendes" />
                    <Input label="Twitter" placeholder="@seuusuario" defaultValue="lucasmendes" />
                    <Input label="YouTube" placeholder="URL do canal" />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}>
                    Salvar Alteracoes
                  </Button>
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <Card>
                <CardTitle>Preferencias de Notificacao</CardTitle>
                <CardContent className="mt-4 space-y-4">
                  {[
                    { label: "Torneios", desc: "Novos torneios, inscricoes e resultados" },
                    { label: "Partidas", desc: "Agenda, placar ao vivo e resultados" },
                    { label: "GCoins", desc: "Transacoes e saldo" },
                    { label: "Social", desc: "Novos seguidores, curtidas e comentarios" },
                    { label: "Chat", desc: "Novas mensagens" },
                    { label: "Palpites", desc: "Resultados dos palpites" },
                    { label: "Marketing", desc: "Novidades e ofertas da plataforma" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {tab === "privacy" && (
              <Card>
                <CardTitle>Privacidade e Seguranca</CardTitle>
                <CardContent className="mt-4 space-y-4">
                  {[
                    { label: "Perfil publico", desc: "Permitir que outros vejam seu perfil" },
                    { label: "Mostrar resultados", desc: "Exibir historico de torneios" },
                    { label: "Mostrar GCoins", desc: "Exibir saldo de GCoins no perfil" },
                    { label: "Permitir mensagens", desc: "Receber mensagens de qualquer usuario" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200">
                    <Button variant="outline" size="sm">Alterar Senha</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {tab === "payment" && (
              <div className="space-y-6">
                <Card>
                  <CardTitle>Chave PIX</CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <Input label="Chave PIX para saques" placeholder="CPF, email, telefone ou chave aleatoria" />
                    <Button variant="outline" size="sm">Salvar Chave PIX</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardTitle>Historico de Pagamentos</CardTitle>
                  <CardContent className="mt-4">
                    <p className="text-sm text-slate-500">Nenhum pagamento realizado ainda.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
        <CardContent className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Sair da conta</p>
            <p className="text-xs text-slate-500">Voce sera desconectado de todos os dispositivos</p>
          </div>
          <Button variant="danger" size="sm">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, CreditCard, LogOut, Camera, Settings, AlertTriangle, Instagram, Twitter, Youtube, Check, Save, Users, Loader2, AlertCircle, Lock } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

export default function SettingsPage() {
  const user = trpc.user.me.useQuery();
  const settings = trpc.user.getSettings.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      user.refetch();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const updateNotificationPrefs = trpc.user.updateNotificationPrefs.useMutation({
    onSuccess: () => settings.refetch(),
  });

  const updatePrivacyPrefs = trpc.user.updatePrivacyPrefs.useMutation({
    onSuccess: () => settings.refetch(),
  });

  const changePassword = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
    },
    onError: (err) => setPasswordError(err.message),
  });

  const savePixKey = trpc.user.savePixKey.useMutation({
    onSuccess: () => {
      user.refetch();
      setPixSaved(true);
      setTimeout(() => setPixSaved(false), 2000);
    },
  });

  const [saved, setSaved] = useState(false);
  const [pixSaved, setPixSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pixKey, setPixKey] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");

  // Populate form when user data loads
  useEffect(() => {
    if (user.data) {
      setName(user.data.name ?? "");
      setPhone(user.data.phone ?? "");
      setCity(user.data.city ?? "");
      setState(user.data.state ?? "");
      setBio(user.data.bio ?? "");
      setInstagram(user.data.instagram ?? "");
      setTwitter(user.data.twitter ?? "");
      setYoutube(user.data.youtube ?? "");
      setPixKey(user.data.pixKey ?? "");
    }
  }, [user.data]);

  const handleSave = () => {
    updateProfile.mutate({
      name: name || undefined,
      phone: phone || undefined,
      city: city || undefined,
      state: state || undefined,
      bio: bio || undefined,
      instagram: instagram || undefined,
      twitter: twitter || undefined,
      youtube: youtube || undefined,
    });
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não conferem");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }
    changePassword.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleSavePixKey = () => {
    if (pixKey.trim()) {
      savePixKey.mutate({ pixKey: pixKey.trim() });
    }
  };

  // Photo upload handler
  const handlePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Maximo 5MB.");
        return;
      }

      try {
        // Get presigned URL
        const res = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
            category: "avatar",
          }),
        });

        if (!res.ok) {
          // Fallback to base64 if presign fails (R2 not configured)
          const reader = new FileReader();
          reader.onload = () => {
            updateProfile.mutate({ image: reader.result as string });
          };
          reader.readAsDataURL(file);
          return;
        }

        const { uploadUrl, publicUrl } = await res.json();

        // Upload directly to R2
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        // Save public URL to profile
        updateProfile.mutate({ image: publicUrl });
      } catch {
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = () => {
          updateProfile.mutate({ image: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (user.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (user.error || !user.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-600 font-medium">Erro ao carregar configuracoes</p>
        <Button variant="outline" size="sm" onClick={() => user.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const profile = user.data;
  const prefs = settings.data;

  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
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
                <Card className="border-l-4 border-l-blue-500 overflow-visible">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Informacoes Pessoais
                  </CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
                        {profile.image ? (
                          <div className="w-20 h-20 rounded-full ring-4 ring-blue-100 ring-offset-2 ring-offset-white overflow-hidden transition-all duration-300 group-hover:ring-blue-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold ring-4 ring-blue-100 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-blue-200">
                            {initials}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 ring-2 ring-white">
                          <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="shadow-sm" onClick={handlePhotoUpload}>
                          <Camera className="w-3.5 h-3.5" />
                          Alterar foto
                        </Button>
                        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG. Max 5MB</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                      <Input label="Email" type="email" value={profile.email} disabled />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo" />
                        <Input label="Estado" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" />
                      </div>
                    </div>
                    <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Conte um pouco sobre você..." />
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Redes Sociais
                  </CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="Instagram" placeholder="@seuusuario" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Twitter className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="Twitter" placeholder="@seuusuario" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Youtube className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Input label="YouTube" placeholder="URL do canal" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {updateProfile.error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>Erro ao salvar: {updateProfile.error.message}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    loading={updateProfile.isPending}
                    onClick={handleSave}
                    className={cn(
                      "min-w-[180px] transition-all duration-300",
                      saved && "bg-gradient-to-r from-blue-500 to-green-500 shadow-lg shadow-blue-500/30"
                    )}
                  >
                    {saved ? (<><Check className="w-4 h-4" />Salvo com Sucesso!</>) : (<><Save className="w-4 h-4" />Salvar Alteracoes</>)}
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
                    { key: "notifyTournaments", label: "Torneios", desc: "Novos torneios, inscricoes e resultados" },
                    { key: "notifyMatches", label: "Partidas", desc: "Agenda, placar ao vivo e resultados" },
                    { key: "notifyGcoins", label: "GCoins", desc: "Transacoes e saldo" },
                    { key: "notifySocial", label: "Social", desc: "Novos seguidores, curtidas e comentarios" },
                    { key: "notifyChat", label: "Chat", desc: "Novas mensagens" },
                    { key: "notifyBets", label: "Palpites", desc: "Resultados dos palpites" },
                    { key: "notifyMarketing", label: "Marketing", desc: "Novidades e ofertas da plataforma" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={prefs ? (prefs[item.key as keyof typeof prefs] as boolean) : true}
                          onChange={(e) => updateNotificationPrefs.mutate({ [item.key]: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500 transition-all duration-300"></div>
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
                    { key: "publicProfile", label: "Perfil publico", desc: "Permitir que outros vejam seu perfil" },
                    { key: "showResults", label: "Mostrar resultados", desc: "Exibir historico de torneios" },
                    { key: "showGcoins", label: "Mostrar GCoins", desc: "Exibir saldo de GCoins no perfil" },
                    { key: "allowMessages", label: "Permitir mensagens", desc: "Receber mensagens de qualquer usuario" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={prefs ? (prefs[item.key as keyof typeof prefs] as boolean) : true}
                          onChange={(e) => updatePrivacyPrefs.mutate({ [item.key]: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500 transition-all duration-300"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 mt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="shadow-sm" onClick={() => setShowPasswordModal(true)}>
                      <Lock className="w-3.5 h-3.5" />
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
                    <Input label="Chave PIX para saques" placeholder="CPF, email, telefone ou chave aleatoria" value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("shadow-sm", pixSaved && "bg-green-50 text-green-700 border-green-300")}
                      onClick={handleSavePixKey}
                      disabled={savePixKey.isPending}
                    >
                      {pixSaved ? (<><Check className="w-3.5 h-3.5" />Salvo!</>) : (<><Save className="w-3.5 h-3.5" />Salvar Chave PIX</>)}
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

      {/* Danger Zone */}
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
            <p className="text-xs text-slate-500 mt-0.5">Você será desconectado de todos os dispositivos</p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="danger" size="sm" className="shadow-sm shadow-red-500/20">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Alterar Senha">
        <div className="space-y-4">
          <Input label="Senha atual" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Digite sua senha atual" />
          <Input label="Nova senha" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Minimo 8 caracteres" />
          <Input label="Confirmar nova senha" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Repita a nova senha" />
          {passwordError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {passwordError}
            </div>
          )}
          <Button className="w-full" onClick={handleChangePassword} loading={changePassword.isPending} disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}>
            <Lock className="w-4 h-4" />
            Alterar Senha
          </Button>
        </div>
      </Modal>
    </div>
  );
}

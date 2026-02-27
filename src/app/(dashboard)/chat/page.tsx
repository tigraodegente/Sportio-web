"use client";

import { useState } from "react";
import { Search, Send, Plus, Phone, Video, MoreVertical, ImageIcon, Smile, Users, MessageSquareText, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const conversations = [
  { id: "1", name: "Rafael Costa", lastMessage: "Bora treinar amanha?", time: "2min", unread: 2, online: true, isGroup: false },
  { id: "2", name: "Equipe Beach Tennis", lastMessage: "Pedro: Confirmados pro torneio!", time: "15min", unread: 5, online: false, isGroup: true, members: 8 },
  { id: "3", name: "Andre Santos", lastMessage: "Parabens pela vitoria!", time: "1h", unread: 0, online: true, isGroup: false },
  { id: "4", name: "Maria Silva", lastMessage: "Vi seu treino, muito bom!", time: "2h", unread: 0, online: false, isGroup: false },
  { id: "5", name: "Grupo CrossFit SP", lastMessage: "Thiago: Treino as 6h amanha", time: "3h", unread: 0, online: false, isGroup: true, members: 24 },
  { id: "6", name: "Carlos Organizador", lastMessage: "Inscricao confirmada!", time: "1d", unread: 0, online: false, isGroup: false },
];

const messages = [
  { id: "1", senderId: "other", content: "E ai Lucas! Tudo bem?", time: "14:30" },
  { id: "2", senderId: "me", content: "Tudo otimo! E voce?", time: "14:31" },
  { id: "3", senderId: "other", content: "Bem demais! Vi que voce ganhou o torneio de Beach Tennis. Parabens!", time: "14:32" },
  { id: "4", senderId: "me", content: "Valeu mano! Foi uma competicao muito boa. Nivel alto dos jogadores.", time: "14:33" },
  { id: "5", senderId: "other", content: "Bora treinar amanha? Posso reservar a quadra na Arena Sportio", time: "14:35" },
  { id: "6", senderId: "me", content: "Bora! Pode ser as 18h?", time: "14:36" },
  { id: "7", senderId: "other", content: "Perfeito! Reservo e te mando a confirmacao", time: "14:37" },
  { id: "8", senderId: "other", content: "Bora treinar amanha?", time: "14:38" },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50">
      {/* Chat List Panel */}
      <div className={cn(
        "w-full sm:w-80 border-r border-slate-100 flex flex-col",
        selectedChat && "hidden sm:flex"
      )}>
        {/* Gradient Header with Search */}
        <div className="bg-gradient-to-b from-slate-50 to-white p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mensagens</h2>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
                {conversations.filter(c => c.unread > 0).length} novas
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="bg-transparent text-sm outline-none w-full text-slate-900 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 hover:bg-slate-50/80 transition-all duration-200 text-left relative",
                selectedChat === conv.id && "bg-emerald-50/70 border-l-2 border-emerald-500",
                selectedChat !== conv.id && "border-l-2 border-transparent"
              )}
            >
              <div className="relative">
                <Avatar name={conv.name} size="md" />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </span>
                )}
                {conv.isGroup && (
                  <span className="absolute -bottom-1 -right-1 bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    <Users className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-sm font-semibold truncate",
                    conv.unread > 0 ? "text-slate-900" : "text-slate-700"
                  )}>{conv.name}</p>
                  <span className={cn(
                    "text-xs whitespace-nowrap ml-2",
                    conv.unread > 0 ? "text-emerald-600 font-medium" : "text-slate-400"
                  )}>{conv.time}</span>
                </div>
                <p className={cn(
                  "text-xs truncate mt-0.5",
                  conv.unread > 0 ? "text-slate-700 font-medium" : "text-slate-500"
                )}>{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="relative flex-shrink-0">
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {conv.unread}
                  </span>
                  <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-slate-100 bg-gradient-to-t from-slate-50/80 to-white">
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50/30 to-white">
          {/* Chat Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button className="sm:hidden mr-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" onClick={() => setSelectedChat(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="relative">
                <Avatar name={selectedConversation?.name} size="sm" />
                {selectedConversation?.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 tracking-tight">{selectedConversation?.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    selectedConversation?.online ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <p className={cn(
                    "text-xs font-medium",
                    selectedConversation?.online ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {selectedConversation?.online ? "Online agora" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.senderId === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                    msg.senderId === "me"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-br-md shadow-emerald-500/20"
                      : "bg-white text-slate-900 rounded-bl-md border border-slate-100 shadow-slate-200/30"
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      msg.senderId === "me" ? "text-emerald-200" : "text-slate-400"
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Area */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-sm focus-within:border-emerald-300 focus-within:shadow-emerald-500/5 transition-all">
              <div className="flex items-center gap-0.5 pl-1">
                <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-all duration-200">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-all duration-200">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none text-slate-900 placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    setMessageInput("");
                  }
                }}
              />
              <Button
                size="icon"
                disabled={!messageInput.trim()}
                className={cn(
                  "rounded-xl flex-shrink-0 transition-all duration-200",
                  messageInput.trim()
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30"
                    : ""
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
          <div className="text-center max-w-xs">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <MessageSquareText className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Suas Mensagens</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Selecione uma conversa ou inicie um novo chat com seus parceiros de treino.
            </p>
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Iniciar Nova Conversa
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

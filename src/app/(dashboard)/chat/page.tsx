"use client";

import { useState } from "react";
import { Search, Send, Plus, Phone, Video, MoreVertical, Image, Smile, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  { id: "4", senderId: "me", content: "Valeu mano! Foi uma competicao muito boa. Nível alto dos jogadores.", time: "14:33" },
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
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Chat List */}
      <div className={cn(
        "w-full sm:w-80 border-r border-slate-200 flex flex-col",
        selectedChat && "hidden sm:flex"
      )}>
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
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
                "w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left",
                selectedChat === conv.id && "bg-emerald-50"
              )}
            >
              <div className="relative">
                <Avatar name={conv.name} size="md" />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
                {conv.isGroup && (
                  <span className="absolute -bottom-1 -right-1 bg-slate-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <Users className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 truncate">{conv.name}</p>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{conv.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-slate-200">
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button className="sm:hidden mr-2" onClick={() => setSelectedChat(null)}>
                ←
              </button>
              <Avatar name={selectedConversation?.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedConversation?.name}</p>
                <p className="text-xs text-green-600">
                  {selectedConversation?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    msg.senderId === "me"
                      ? "bg-emerald-600 text-white rounded-br-md"
                      : "bg-slate-100 text-slate-900 rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
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

          {/* Message Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 text-slate-900"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    setMessageInput("");
                  }
                }}
              />
              <Button size="icon" disabled={!messageInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center text-slate-400">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Selecione uma conversa para comecar</p>
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

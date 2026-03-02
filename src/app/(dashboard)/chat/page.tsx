"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Send,
  Plus,
  Phone,
  Video,
  MoreVertical,
  ImageIcon,
  Smile,
  Users,
  MessageSquareText,
  Sparkles,
  Mic,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

function formatTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function getRoomDisplayName(
  room: {
    name?: string | null;
    isGroup?: boolean | null;
    members: { user: { id: string; name: string } }[];
  },
  currentUserId: string | undefined
) {
  if (room.isGroup && room.name) return room.name;
  const otherMember = room.members.find((m) => m.user.id !== currentUserId);
  return otherMember?.user.name ?? "Chat";
}

function getRoomImage(
  room: {
    image?: string | null;
    isGroup?: boolean | null;
    members: { user: { id: string; image?: string | null } }[];
  },
  currentUserId: string | undefined
) {
  if (room.image) return room.image;
  if (!room.isGroup) {
    const otherMember = room.members.find((m) => m.user.id !== currentUserId);
    return otherMember?.user.image ?? null;
  }
  return null;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const me = trpc.user.me.useQuery();
  const currentUserId = me.data?.id;

  // Track window focus state for adaptive polling
  useEffect(() => {
    const onFocus = () => setIsWindowFocused(true);
    const onBlur = () => setIsWindowFocused(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const rooms = trpc.chat.myRooms.useQuery(undefined, {
    refetchInterval: isWindowFocused ? 3000 : 10000,
    refetchOnWindowFocus: true,
  });

  const messages = trpc.chat.messages.useQuery(
    { roomId: selectedChat!, limit: 50 },
    {
      enabled: !!selectedChat,
      refetchInterval: isWindowFocused ? 2000 : 8000,
      refetchOnWindowFocus: true,
    }
  );

  const sendMessage = trpc.chat.sendMessage.useMutation({
    // Optimistic update: immediately show the message in the UI
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await utils.chat.messages.cancel({ roomId: newMessage.roomId, limit: 50 });

      // Snapshot previous value
      const previousMessages = utils.chat.messages.getData({
        roomId: newMessage.roomId,
        limit: 50,
      });

      // Optimistically add the new message
      if (previousMessages && currentUserId && me.data) {
        const optimisticMessage = {
          id: `optimistic-${Date.now()}`,
          roomId: newMessage.roomId,
          senderId: currentUserId,
          content: newMessage.content,
          images: newMessage.images ?? null,
          isEdited: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: me.data,
        };

        utils.chat.messages.setData(
          { roomId: newMessage.roomId, limit: 50 },
          {
            ...previousMessages,
            items: [...(previousMessages.items ?? []), optimisticMessage as unknown as typeof previousMessages.items[0]],
          }
        );
      }

      return { previousMessages };
    },
    onError: (_err, newMessage, context) => {
      // Roll back to the previous value on error
      if (context?.previousMessages) {
        utils.chat.messages.setData(
          { roomId: newMessage.roomId, limit: 50 },
          context.previousMessages
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      // Refetch to sync with server
      utils.chat.messages.invalidate({ roomId: variables.roomId, limit: 50 });
      utils.chat.myRooms.invalidate();
    },
  });

  const userSearch = trpc.user.search.useQuery(
    { query: userSearchQuery, limit: 10 },
    { enabled: userSearchQuery.length >= 2 }
  );

  const createDM = trpc.chat.createDM.useMutation({
    onSuccess: (room) => {
      setShowNewChatModal(false);
      setUserSearchQuery("");
      rooms.refetch();
      if (room) setSelectedChat(room.id);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Check if user is near the bottom of the messages container
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 150;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Auto-scroll when messages change, but only if user is near the bottom
  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  }, [messages.data?.items, scrollToBottom, isNearBottom]);

  const filteredRooms = (rooms.data ?? []).filter((room) => {
    if (!searchQuery.trim()) return true;
    const name = getRoomDisplayName(room, currentUserId);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedRoom = (rooms.data ?? []).find((r) => r.id === selectedChat);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedChat) return;
    sendMessage.mutate({
      roomId: selectedChat,
      content: messageInput.trim(),
    });
    setMessageInput("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50">
      {/* Chat List Panel */}
      <div
        className={cn(
          "w-full sm:w-80 border-r border-slate-100 flex flex-col",
          selectedChat && "hidden sm:flex"
        )}
      >
        {/* Gradient Header with Search */}
        <div className="bg-gradient-to-b from-slate-50 to-white p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/25">
                <MessageSquareText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Mensagens
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 border border-blue-100">
                {filteredRooms.length} conversas
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
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
          {rooms.isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400">Carregando conversas...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <MessageSquareText className="w-10 h-10 text-slate-300" />
              <p className="text-sm text-slate-400">
                {searchQuery
                  ? "Nenhuma conversa encontrada"
                  : "Nenhuma conversa ainda"}
              </p>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const displayName = getRoomDisplayName(room, currentUserId);
              const roomImage = getRoomImage(room, currentUserId);
              const lastMessage = room.messages?.[0];

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedChat(room.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-slate-50/80 transition-all duration-200 text-left relative group",
                    selectedChat === room.id &&
                      "bg-blue-50/70 border-l-2 border-blue-500",
                    selectedChat !== room.id && "border-l-2 border-transparent"
                  )}
                >
                  <div className="relative">
                    <Avatar
                      name={displayName}
                      src={roomImage}
                      size="md"
                    />
                    {room.isGroup && (
                      <span className="absolute -bottom-1 -right-1 bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        <Users className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate text-slate-900">
                        {displayName}
                      </p>
                      {lastMessage && (
                        <span className="text-xs whitespace-nowrap ml-2 text-slate-400">
                          {formatRelativeTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {lastMessage ? (
                        <p className="text-xs truncate text-slate-500">
                          {lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-xs truncate text-slate-400 italic">
                          Nenhuma mensagem ainda
                        </p>
                      )}
                    </div>
                  </div>
                  {room.isGroup && (
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {room.members.length} membros
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-slate-100 bg-gradient-to-t from-slate-50/80 to-white">
          <Button className="w-full" variant="outline" onClick={() => setShowNewChatModal(true)}>
            <Plus className="w-4 h-4" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat && selectedRoom ? (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50/30 to-white">
          {/* Chat Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                className="sm:hidden mr-1 p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                onClick={() => setSelectedChat(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <div className="relative">
                <Avatar
                  name={getRoomDisplayName(selectedRoom, currentUserId)}
                  src={getRoomImage(selectedRoom, currentUserId)}
                  size="sm"
                  className="ring-2 ring-blue-100"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 tracking-tight">
                  {getRoomDisplayName(selectedRoom, currentUserId)}
                </p>
                <div className="flex items-center gap-1.5">
                  {selectedRoom.isGroup ? (
                    <p className="text-xs font-medium text-slate-400">
                      {selectedRoom.members.length} membros
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-slate-400">Chat</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <Phone className="w-[18px] h-[18px]" />
              </button>
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <Video className="w-[18px] h-[18px]" />
              </button>
              <div className="w-px h-5 bg-slate-100 mx-1" />
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                <MoreVertical className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {messages.isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-400">
                  Carregando mensagens...
                </p>
              </div>
            ) : !messages.data?.items?.length ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <MessageSquareText className="w-10 h-10 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Nenhuma mensagem ainda. Diga oi!
                </p>
              </div>
            ) : (
              <>
                {/* Date divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-slate-200/60" />
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100/80 rounded-full px-3 py-1">
                    Mensagens
                  </span>
                  <div className="flex-1 h-px bg-slate-200/60" />
                </div>

                {messages.data.items.map((msg) => {
                  const isMe = msg.sender.id === currentUserId;
                  const imageList: string[] =
                    Array.isArray(msg.images) ? (msg.images as string[]) : [];

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {!isMe && (
                          <Avatar
                            name={msg.sender.name}
                            src={msg.sender.image}
                            size="sm"
                            className="flex-shrink-0 mb-1"
                          />
                        )}
                        <div>
                          {!isMe && selectedRoom.isGroup && (
                            <p className="text-[11px] font-medium text-slate-500 mb-1 ml-1">
                              {msg.sender.name}
                            </p>
                          )}
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 transition-all duration-200",
                              isMe
                                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25"
                                : "bg-white text-slate-900 rounded-bl-md border border-slate-100 shadow-sm shadow-slate-200/30 hover:shadow-md"
                            )}
                          >
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            {imageList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {imageList.map((img, idx) => (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      key={idx}
                                      src={img}
                                      alt="Imagem"
                                      className="rounded-lg max-w-[200px] max-h-[200px] object-cover"
                                    />
                                  ))}
                                </div>
                              )}
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1 mt-1",
                                isMe ? "text-blue-200" : "text-slate-400"
                              )}
                            >
                              <p className="text-[10px]">
                                {formatTime(msg.createdAt)}
                              </p>
                              {isMe && <CheckCheck className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input Area */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200/80 shadow-sm shadow-slate-200/30 focus-within:border-blue-300 focus-within:shadow-md focus-within:shadow-blue-500/5 transition-all duration-300">
              <div className="flex items-center gap-0.5 pl-1">
                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all duration-200">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-white transition-all duration-200">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-white transition-all duration-200">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none text-slate-900 placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && messageInput.trim()) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                disabled={!messageInput.trim() || sendMessage.isPending}
                onClick={handleSend}
                className={cn(
                  "rounded-xl flex-shrink-0 transition-all duration-300",
                  messageInput.trim()
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                    : "bg-slate-200 text-slate-400 shadow-none"
                )}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <div className="text-center max-w-xs">
            {/* Decorative rings */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-200/40 to-blue-100/20 rotate-6 scale-110" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100/50 to-blue-50/30 -rotate-3 scale-105" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                <MessageSquareText className="w-11 h-11 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
              Suas Mensagens
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Selecione uma conversa ou inicie um novo chat com seus parceiros
              de treino.
            </p>
            <Button variant="outline" className="gap-2 shadow-sm" onClick={() => setShowNewChatModal(true)}>
              <Sparkles className="w-4 h-4 text-blue-500" />
              Iniciar Nova Conversa
            </Button>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      <Modal isOpen={showNewChatModal} onClose={() => { setShowNewChatModal(false); setUserSearchQuery(""); }} title="Nova Conversa">
        <div className="space-y-4">
          <Input
            label="Buscar usuario"
            placeholder="Digite o nome do usuario..."
            icon={<Search className="w-4 h-4" />}
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
          {userSearchQuery.length >= 2 && (
            <div className="max-h-60 overflow-y-auto space-y-1">
              {userSearch.isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              ) : !userSearch.data?.items?.length ? (
                <p className="text-sm text-slate-400 text-center py-4">Nenhum usuario encontrado</p>
              ) : (
                userSearch.data.items
                  .filter((u) => u.id !== currentUserId)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => createDM.mutate({ userId: user.id })}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left"
                      disabled={createDM.isPending}
                    >
                      <Avatar name={user.name} src={user.image} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <MessageSquareText className="w-4 h-4 text-slate-300" />
                    </button>
                  ))
              )}
            </div>
          )}
          {userSearchQuery.length < 2 && (
            <p className="text-xs text-slate-400 text-center py-4">Digite pelo menos 2 caracteres para buscar</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

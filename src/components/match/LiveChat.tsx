"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/mock/match-data";

interface LiveChatProps {
  messages: ChatMessage[];
}

export function LiveChat({ messages: initialMessages }: LiveChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      username: "Voce",
      message: input.trim(),
      timestamp: "agora",
      isVip: false,
    };
    setMessages((prev) => [...prev.slice(-99), newMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Chat ao Vivo</h3>
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="h-64 overflow-y-auto p-3 space-y-1.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "px-3 py-2 rounded-lg",
                msg.isSuper
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                  : "hover:bg-slate-700/30"
              )}
            >
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      msg.isVip ? "text-amber-400" : msg.isSuper ? "text-orange-300" : "text-blue-400"
                    )}
                  >
                    {msg.username}
                  </span>
                  {msg.isVip && (
                    <span className="px-1 py-px bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded uppercase">
                      VIP
                    </span>
                  )}
                  {msg.isSuper && (
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5 break-words">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-700/50 p-3">
          <div className="flex items-center gap-2">
            <button
              title="Presente (5 GC)"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 transition-colors shrink-0"
            >
              <Gift className="w-4 h-4" />
            </button>
            <button
              title="Super Comentario"
              className="p-2 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-slate-700/50 transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "p-2 rounded-lg transition-colors shrink-0",
                input.trim()
                  ? "text-blue-400 hover:bg-blue-500/20"
                  : "text-slate-600 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

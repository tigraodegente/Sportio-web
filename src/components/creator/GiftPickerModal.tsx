"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Coins } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatGCoins } from "@/lib/utils";
import type { GiftType } from "@/lib/types/creator";

interface GiftPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifts: GiftType[];
  recipientName: string;
  balance?: number;
}

export function GiftPickerModal({ isOpen, onClose, gifts, recipientName, balance = 5000 }: GiftPickerModalProps) {
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!selectedGift) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedGift(null);
      setMessage("");
      onClose();
    }, 1500);
  };

  const canAfford = selectedGift ? balance >= selectedGift.cost : true;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enviar Gift para ${recipientName}`} size="md">
      {/* Balance */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl">
        <span className="text-sm text-slate-600">Seu saldo</span>
        <span className="flex items-center gap-1.5 font-bold text-amber-600">
          <Coins className="w-4 h-4" />
          {formatGCoins(balance)}
        </span>
      </div>

      {/* Gift grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {gifts.map((gift) => {
          const isSelected = selectedGift?.id === gift.id;
          const affordable = balance >= gift.cost;

          return (
            <button
              key={gift.id}
              onClick={() => affordable && setSelectedGift(gift)}
              disabled={!affordable}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                  : affordable
                  ? "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  : "border-slate-100 opacity-40 cursor-not-allowed"
              }`}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-[8px] text-white">&#10003;</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-2xl">{gift.emoji}</span>
              <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">
                {gift.name}
              </span>
              <span className="text-[10px] font-bold text-amber-600">
                {gift.cost} GC
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected gift animation preview */}
      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 text-center"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              className="text-5xl inline-block"
            >
              {selectedGift.emoji}
            </motion.span>
            <p className="text-sm text-slate-600 mt-1">
              {selectedGift.name} — {selectedGift.cost} GC
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escreva uma mensagem (opcional)..."
        className="w-full resize-none border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all mb-4"
        rows={2}
      />

      {/* Send button */}
      <Button
        variant="accent"
        size="lg"
        className="w-full"
        onClick={handleSend}
        disabled={!selectedGift || !canAfford || sent}
        loading={sent}
      >
        {sent ? (
          "Enviado!"
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar Gift
            {selectedGift && ` (${selectedGift.cost} GC)`}
          </>
        )}
      </Button>

      {selectedGift && !canAfford && (
        <p className="text-xs text-red-500 text-center mt-2">
          Saldo insuficiente. Recarregue seus GCoins.
        </p>
      )}
    </Modal>
  );
}

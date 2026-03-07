"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGCoins } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGift } from "@/contexts/GiftContext";
import { GIFT_TYPES, type GiftType } from "@/lib/mock/gift-data";

// ============================================
// Mock balance — replace with real wallet data
// ============================================
const MOCK_BALANCE = 1250;

export function GiftPickerModal() {
  const { isPickerOpen, pickerTarget, closeGiftPicker, showGiftAnimation } = useGift();
  const [selected, setSelected] = useState<GiftType | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const balance = MOCK_BALANCE;
  const insufficientBalance = selected !== null && selected.cost > 0 && selected.cost > balance;

  const handleSend = async () => {
    if (!selected || !pickerTarget || insufficientBalance) return;
    setSending(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));

    showGiftAnimation({
      id: `anim-${Date.now()}`,
      giftType: selected,
      senderName: "Voce",
      receiverName: pickerTarget.userName,
    });

    setSending(false);
    setSelected(null);
    setMessage("");
    closeGiftPicker();
  };

  const handleClose = () => {
    setSelected(null);
    setMessage("");
    closeGiftPicker();
  };

  return (
    <AnimatePresence>
      {isPickerOpen && pickerTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {"\u{1F381}"} Enviar Gift para @{pickerTarget.userName}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Gift Grid */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {GIFT_TYPES.map((gift) => {
                  const isSelected = selected?.id === gift.id;
                  const isCustom = gift.id === "personalizado";
                  return (
                    <motion.button
                      key={gift.id}
                      onClick={() => setSelected(gift)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-md shadow-green-500/20"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <motion.span
                        className="text-2xl"
                        animate={isSelected ? { scale: [1, 1.3, 1.1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {gift.emoji}
                      </motion.span>
                      <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                        {gift.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          isSelected ? "text-green-600" : "text-slate-400"
                        )}
                      >
                        {isCustom ? "Custom" : gift.costLabel}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mensagem (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                  placeholder="Escreva uma mensagem..."
                  rows={2}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block text-right">
                  {message.length}/100
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl mb-4">
                <span className="text-sm text-slate-600">Saldo:</span>
                <span className="text-sm font-bold text-slate-900">{formatGCoins(balance)}</span>
              </div>

              {/* Insufficient balance warning */}
              {insufficientBalance && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 font-medium text-center mb-3"
                >
                  Saldo insuficiente para este gift
                </motion.p>
              )}

              {/* Send Button */}
              <Button
                className="w-full"
                size="lg"
                variant={insufficientBalance ? "ghost" : "accent"}
                disabled={!selected || insufficientBalance || selected.id === "personalizado"}
                loading={sending}
                onClick={handleSend}
              >
                {selected
                  ? `ENVIAR ${selected.emoji} ${selected.name.toUpperCase()} \u2014 ${selected.cost > 0 ? formatGCoins(selected.cost) : "Custom"}`
                  : "Selecione um gift"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { GiftType } from "@/lib/mock/gift-data";

// ============================================
// Types
// ============================================

export interface GiftAnimationData {
  id: string;
  giftType: GiftType;
  senderName: string;
  receiverName: string;
}

interface GiftPickerTarget {
  userId: string;
  userName: string;
  postId?: string;
}

interface GiftContextValue {
  /** Open the gift picker modal for a target user/post */
  openGiftPicker: (target: GiftPickerTarget) => void;
  closeGiftPicker: () => void;
  pickerTarget: GiftPickerTarget | null;
  isPickerOpen: boolean;

  /** Show a gift animation (queued if another is playing) */
  showGiftAnimation: (data: GiftAnimationData) => void;
  currentAnimation: GiftAnimationData | null;
  dismissAnimation: () => void;
}

// ============================================
// Context
// ============================================

const GiftContext = createContext<GiftContextValue | null>(null);

export function useGift() {
  const ctx = useContext(GiftContext);
  if (!ctx) throw new Error("useGift must be used within GiftProvider");
  return ctx;
}

// ============================================
// Provider
// ============================================

export function GiftProvider({ children }: { children: ReactNode }) {
  const [pickerTarget, setPickerTarget] = useState<GiftPickerTarget | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<GiftAnimationData | null>(null);
  const queueRef = useRef<GiftAnimationData[]>([]);

  const openGiftPicker = useCallback((target: GiftPickerTarget) => {
    setPickerTarget(target);
  }, []);

  const closeGiftPicker = useCallback(() => {
    setPickerTarget(null);
  }, []);

  const playNext = useCallback(() => {
    if (queueRef.current.length > 0) {
      const next = queueRef.current.shift()!;
      setCurrentAnimation(next);
    } else {
      setCurrentAnimation(null);
    }
  }, []);

  const showGiftAnimation = useCallback(
    (data: GiftAnimationData) => {
      if (currentAnimation) {
        queueRef.current.push(data);
      } else {
        setCurrentAnimation(data);
      }
    },
    [currentAnimation]
  );

  const dismissAnimation = useCallback(() => {
    playNext();
  }, [playNext]);

  return (
    <GiftContext.Provider
      value={{
        openGiftPicker,
        closeGiftPicker,
        pickerTarget,
        isPickerOpen: pickerTarget !== null,
        showGiftAnimation,
        currentAnimation,
        dismissAnimation,
      }}
    >
      {children}
    </GiftContext.Provider>
  );
}

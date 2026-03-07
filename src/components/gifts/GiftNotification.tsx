"use client";

import { toast } from "sonner";
import { formatGCoins } from "@/lib/utils";
import type { GiftType } from "@/lib/mock/gift-data";

interface GiftNotificationData {
  senderName: string;
  giftType: GiftType;
  message?: string | null;
  postId?: string | null;
}

/**
 * Shows a Sonner toast notification when a gift is received.
 * Call this imperatively: `showGiftNotification({ ... })`
 */
export function showGiftNotification({ senderName, giftType, message, postId }: GiftNotificationData) {
  toast.custom(
    (t) => (
      <div
        className="flex items-start gap-3 bg-white border border-amber-200 rounded-xl p-4 shadow-lg shadow-amber-100/50 cursor-pointer max-w-sm w-full"
        onClick={() => {
          if (postId) {
            window.location.href = `/social?post=${postId}`;
          }
          toast.dismiss(t);
        }}
      >
        {/* Gift emoji */}
        <span className="text-3xl flex-shrink-0">{giftType.emoji}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">
            @{senderName} enviou {giftType.name}!
          </p>
          <p className="text-xs text-amber-600 font-semibold mt-0.5">
            +{formatGCoins(giftType.cost)}
          </p>
          {message && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              &ldquo;{message}&rdquo;
            </p>
          )}
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-right",
    }
  );
}

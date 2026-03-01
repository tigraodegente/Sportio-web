"use client";

import { useState } from "react";
import { ImageIcon, Send, Smile, X, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface CreatePostFormProps {
  currentUser?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  onPostCreated?: () => void;
}

export function CreatePostForm({ currentUser, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [focusedCompose, setFocusedCompose] = useState(false);
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>();
  const [showSportPicker, setShowSportPicker] = useState(false);

  const utils = trpc.useUtils();

  const sportsQuery = trpc.social.getSports.useQuery();

  const createPost = trpc.social.createPost.useMutation({
    onSuccess: () => {
      setContent("");
      setSelectedSportId(undefined);
      setFocusedCompose(false);
      onPostCreated?.();
      utils.social.feed.invalidate();
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    createPost.mutate({
      content: content.trim(),
      sportId: selectedSportId,
    });
  };

  const selectedSport = sportsQuery.data?.find((s) => s.id === selectedSportId);

  if (!currentUser) {
    return (
      <Card className="text-center py-6">
        <p className="text-slate-500 text-sm">
          Faça login para publicar no feed
        </p>
      </Card>
    );
  }

  return (
    <Card
      className={`transition-all duration-300 ${
        focusedCompose
          ? "ring-2 ring-blue-500/30 border-blue-200 shadow-lg shadow-blue-500/5"
          : ""
      }`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          <Avatar src={currentUser.image} name={currentUser.name ?? "Você"} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocusedCompose(true)}
            onBlur={() => !content && setFocusedCompose(false)}
            placeholder="O que está acontecendo?"
            className="w-full resize-none border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none min-h-[60px] text-[15px] leading-relaxed bg-transparent"
            rows={focusedCompose ? 3 : 2}
          />

          {/* Selected sport tag */}
          {selectedSport && (
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                {selectedSport.icon} {selectedSport.name}
                <button
                  onClick={() => setSelectedSportId(undefined)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex gap-1">
              <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all duration-200">
                <Smile className="w-5 h-5" />
              </button>

              {/* Sport picker */}
              <div className="relative">
                <button
                  onClick={() => setShowSportPicker(!showSportPicker)}
                  className="flex items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-xs font-medium"
                >
                  Esporte
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showSportPicker && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl border border-slate-100 shadow-xl py-1 z-20 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedSportId(undefined);
                        setShowSportPicker(false);
                      }}
                      className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Nenhum
                    </button>
                    {sportsQuery.data?.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => {
                          setSelectedSportId(sport.id);
                          setShowSportPicker(false);
                        }}
                        className={`flex items-center gap-2 w-full px-3.5 py-2 text-sm transition-colors ${
                          selectedSportId === sport.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span>{sport.icon}</span>
                        {sport.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              size="sm"
              disabled={!content.trim() || createPost.isPending}
              loading={createPost.isPending}
              onClick={handleSubmit}
              className="shadow-md"
            >
              <Send className="w-4 h-4" />
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { Heart, MessageCircle, Gift, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { CreatorPost, CreatorProfile } from "@/lib/mock/creator-data";
import { formatDistanceToNow } from "@/lib/utils";

interface PostsTabProps {
  posts: CreatorPost[];
  creator: CreatorProfile;
}

export function PostsTab({ posts, creator }: PostsTabProps) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {post.isGated ? (
            <GatedPost post={post} creator={creator} />
          ) : (
            <PublicPost post={post} creator={creator} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function PublicPost({ post, creator }: { post: CreatorPost; creator: CreatorProfile }) {
  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={creator.avatar} name={creator.name} size="md" />
        <div>
          <span className="text-sm font-bold text-slate-900">{creator.name}</span>
          <p className="text-xs text-slate-400">{formatDistanceToNow(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50/50 transition-all">
          <Heart className="w-4 h-4" />
          <span className="font-medium">{post.likesCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50/50 transition-all">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.commentsCount}</span>
        </button>
        {post.giftsReceived > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600 px-3 py-1.5 ml-auto">
            <Gift className="w-4 h-4" />
            <span className="font-medium">{post.giftsReceived} gifts</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function GatedPost({ post, creator }: { post: CreatorPost; creator: CreatorProfile }) {
  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={creator.avatar} name={creator.name} size="md" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{creator.name}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200/50">
              <Lock className="w-2.5 h-2.5" />
              {post.requiredTier}
            </span>
          </div>
          <p className="text-xs text-slate-400">{formatDistanceToNow(post.createdAt)}</p>
        </div>
      </div>

      {/* Blurred content */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="select-none"
          style={{ filter: "blur(6px)" }}
        >
          <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap pointer-events-none">
            {post.content}
          </p>
        </motion.div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Conteudo exclusivo {post.requiredTier}</p>
            <Button variant="accent" size="sm">
              Assinar para Desbloquear — R${post.tierPrice?.toFixed(2).replace(".", ",")}
            </Button>
          </div>
        </div>
      </div>

      {/* Actions (dimmed) */}
      <div className="flex items-center gap-1 pt-3 border-t border-slate-100 opacity-50 pointer-events-none mt-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 px-3 py-1.5">
          <Heart className="w-4 h-4" />
          <span className="font-medium">{post.likesCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 px-3 py-1.5">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.commentsCount}</span>
        </div>
      </div>
    </Card>
  );
}

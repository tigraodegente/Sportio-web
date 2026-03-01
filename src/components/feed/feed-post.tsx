"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Copy,
  Link2,
  Flag,
  Trash2,
  Edit3,
  ChevronDown,
  Send,
  X,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "@/lib/utils";

interface FeedPostUser {
  id: string;
  name: string;
  image: string | null;
}

interface FeedPostComment {
  id: string;
  content: string;
  createdAt: Date;
  user: FeedPostUser;
  parentId: string | null;
}

interface FeedPostSport {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

interface FeedPostProps {
  post: {
    id: string;
    content: string;
    images: unknown;
    likesCount: number | null;
    commentsCount: number | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: FeedPostUser;
    sport: FeedPostSport | null;
    comments: FeedPostComment[];
    isLiked: boolean;
  };
  currentUserId?: string;
  onPostDeleted?: () => void;
}

function getSportColor(sportName: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    "Beach Tennis": { bg: "bg-amber-100", text: "text-amber-700" },
    CrossFit: { bg: "bg-red-100", text: "text-red-700" },
    Futebol: { bg: "bg-green-100", text: "text-green-700" },
    Corrida: { bg: "bg-blue-100", text: "text-blue-700" },
    "Vôlei": { bg: "bg-yellow-100", text: "text-yellow-700" },
    "Futevôlei": { bg: "bg-orange-100", text: "text-orange-700" },
    Basquete: { bg: "bg-orange-100", text: "text-orange-700" },
    Padel: { bg: "bg-blue-100", text: "text-blue-700" },
    "Jiu-Jitsu": { bg: "bg-slate-100", text: "text-slate-700" },
    "Muay Thai": { bg: "bg-red-100", text: "text-red-700" },
    Natação: { bg: "bg-cyan-100", text: "text-cyan-700" },
    Surf: { bg: "bg-cyan-100", text: "text-cyan-700" },
    Ciclismo: { bg: "bg-teal-100", text: "text-teal-700" },
    "E-Sports": { bg: "bg-purple-100", text: "text-purple-700" },
  };
  return colors[sportName] || { bg: "bg-slate-100", text: "text-slate-600" };
}

export function FeedPost({ post, currentUserId, onPostDeleted }: FeedPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [commentText, setCommentText] = useState("");
  const [localLiked, setLocalLiked] = useState(post.isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount ?? 0);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount ?? 0);
  const [copied, setCopied] = useState(false);

  const shareMenuRef = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();

  const isOwner = currentUserId === post.userId;
  const images = (Array.isArray(post.images) ? post.images : []) as string[];

  // Toggle like mutation
  const toggleLike = trpc.social.toggleLike.useMutation({
    onMutate: () => {
      setLocalLiked((prev) => !prev);
      setLocalLikesCount((prev) => (localLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setLocalLiked((prev) => !prev);
      setLocalLikesCount((prev) => (localLiked ? prev + 1 : prev - 1));
    },
  });

  // Add comment mutation
  const addComment = trpc.social.addComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      setLocalCommentsCount((prev) => prev + 1);
      utils.social.getComments.invalidate({ postId: post.id });
      utils.social.feed.invalidate();
    },
  });

  // Delete post mutation
  const deletePost = trpc.social.deletePost.useMutation({
    onSuccess: () => {
      onPostDeleted?.();
      utils.social.feed.invalidate();
    },
  });

  // Edit post mutation
  const editPost = trpc.social.editPost.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      utils.social.feed.invalidate();
    },
  });

  // Get all comments when expanded
  const commentsQuery = trpc.social.getComments.useQuery(
    { postId: post.id },
    { enabled: showComments }
  );

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
        setShowPostMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = () => {
    if (!currentUserId) return;
    toggleLike.mutate({ postId: post.id });
  };

  const handleComment = () => {
    if (!commentText.trim() || !currentUserId) return;
    addComment.mutate({ postId: post.id, content: commentText.trim() });
  };

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;
    deletePost.mutate({ postId: post.id });
    setShowPostMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
    setShowPostMenu(false);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    editPost.mutate({ postId: post.id, content: editContent.trim() });
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/social?post=${post.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  const sportColor = post.sport ? getSportColor(post.sport.name) : null;

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={post.user.image} name={post.user.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{post.user.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(post.createdAt)}
              </span>
              {post.createdAt.getTime() !== post.updatedAt.getTime() && (
                <span className="text-[10px] text-slate-400">(editado)</span>
              )}
              {post.sport && sportColor && (
                <>
                  <span className="text-slate-300">&middot;</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${sportColor.bg} ${sportColor.text}`}
                  >
                    {post.sport.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post Menu */}
        <div className="relative" ref={postMenuRef}>
          <button
            onClick={() => setShowPostMenu(!showPostMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showPostMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 py-1.5 z-20 animate-fade-in">
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </>
              )}
              {!isOwner && (
                <button className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Flag className="w-4 h-4" />
                  Reportar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full resize-none border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSaveEdit} loading={editPost.isPending}>
              <Check className="w-4 h-4" />
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-slate-800 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">
          {post.content}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className={`mb-4 gap-2 rounded-xl overflow-hidden ${images.length === 1 ? "" : "grid grid-cols-2"}`}>
          {images.map((img, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={img}
              alt={`Imagem ${i + 1}`}
              className="w-full h-auto object-cover rounded-xl max-h-96"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={!currentUserId}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all duration-200 group ${
            localLiked
              ? "text-red-500 bg-red-50/80"
              : "text-slate-500 hover:text-red-500 hover:bg-red-50/50"
          } ${!currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              localLiked ? "fill-current" : ""
            }`}
          />
          <span className="font-medium">{localLikesCount}</span>
        </button>

        {/* Comment button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[11px] min-w-[20px] text-center">
            {localCommentsCount}
          </span>
        </button>

        {/* Share button */}
        <div className="relative ml-auto" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Compartilhar</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                showShareMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showShareMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 py-1.5 z-10 animate-fade-in">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link copiado!" : "Copiar link"}
              </button>
              <button className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Link2 className="w-4 h-4" />
                Compartilhar externo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {/* Existing comments */}
          {commentsQuery.isLoading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {commentsQuery.data?.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 ml-2">
              <Avatar src={comment.user.image} name={comment.user.name} size="sm" />
              <div className="flex-1 border-l-2 border-blue-200 pl-3">
                <div className="bg-slate-50/80 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{comment.user.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDistanceToNow(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {commentsQuery.data?.length === 0 && !commentsQuery.isLoading && (
            <p className="text-sm text-slate-400 text-center py-2">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          )}

          {/* Comment input */}
          {currentUserId && (
            <div className="flex gap-2.5 ml-2 pt-1">
              <Avatar name="Você" size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  placeholder="Escrever comentário..."
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleComment}
                  disabled={!commentText.trim() || addComment.isPending}
                  loading={addComment.isPending}
                  className="hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {!currentUserId && (
            <p className="text-sm text-slate-400 text-center py-2">
              Faça login para comentar
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

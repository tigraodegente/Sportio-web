"use client";

import { useState } from "react";
import { ImageIcon, Send, Heart, MessageCircle, Share2, MoreHorizontal, Smile, ChevronDown, Link2, Copy, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const feedPosts = [
  {
    id: "1",
    user: { name: "Lucas Mendes", image: null, role: "Atleta" },
    content: "Mais uma vitoria no torneio de Beach Tennis! Classificado para as semifinais da Copa SP. Bora pra cima! 🏆🎾",
    sport: "Beach Tennis",
    likes: 42,
    comments: 8,
    isLiked: true,
    timeAgo: "2h",
    commentsList: [
      { id: "c1", user: { name: "Rafael Costa", image: null }, content: "Parabens campeao! Nos vemos na semi!", timeAgo: "1h" },
      { id: "c2", user: { name: "Maria Silva", image: null }, content: "Arrasou demais!", timeAgo: "45min" },
    ],
  },
  {
    id: "2",
    user: { name: "Arena Sportio SP", image: null, role: "Arena" },
    content: "Nova quadra de Beach Tennis inaugurada! Venham conferir nossas instalacoes renovadas. Agendamentos ja abertos pelo app.",
    sport: "Beach Tennis",
    likes: 89,
    comments: 15,
    isLiked: false,
    timeAgo: "4h",
    commentsList: [],
  },
  {
    id: "3",
    user: { name: "Pedro Lima", image: null, role: "Atleta" },
    content: "Treino de CrossFit pesado hoje! PR no Clean & Jerk - 120kg. A evolucao e diaria. Quem treina nao para! 💪",
    sport: "CrossFit",
    likes: 67,
    comments: 12,
    isLiked: false,
    timeAgo: "6h",
    commentsList: [
      { id: "c3", user: { name: "Thiago Rocha", image: null }, content: "Monstro! Rumo aos 130kg!", timeAgo: "5h" },
    ],
  },
  {
    id: "4",
    user: { name: "Liga Sportio", image: null, role: "Organizador" },
    content: "Inscricoes abertas para a Liga de Futebol Society! 16 vagas disponiveis. Premiacao de 10.000 GCoins. Corre que as vagas estao acabando!",
    sport: "Futebol",
    likes: 156,
    comments: 34,
    isLiked: true,
    timeAgo: "8h",
    commentsList: [],
  },
];

function getRoleBadgeVariant(role: string): "primary" | "accent" | "info" | "default" {
  switch (role) {
    case "Atleta":
      return "primary";
    case "Arena":
      return "accent";
    case "Organizador":
      return "info";
    default:
      return "default";
  }
}

function getSportColor(sport: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    "Beach Tennis": { bg: "bg-amber-100", text: "text-amber-700" },
    CrossFit: { bg: "bg-red-100", text: "text-red-700" },
    Futebol: { bg: "bg-green-100", text: "text-green-700" },
    Corrida: { bg: "bg-blue-100", text: "text-blue-700" },
  };
  return colors[sport] || { bg: "bg-slate-100", text: "text-slate-600" };
}

export default function SocialPage() {
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [focusedCompose, setFocusedCompose] = useState(false);

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleShareMenu = (postId: string) => {
    setShowShareMenu((prev) => (prev === postId ? null : postId));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Feed</h1>
        <p className="text-slate-500 mt-0.5">Veja o que esta acontecendo no mundo esportivo</p>
      </div>

      {/* New Post */}
      <Card
        className={`transition-all duration-300 ${
          focusedCompose
            ? "ring-2 ring-blue-500/30 border-blue-200 shadow-lg shadow-blue-500/5"
            : ""
        }`}
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 pt-1">
            <Avatar name="Usuario" size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onFocus={() => setFocusedCompose(true)}
              onBlur={() => setFocusedCompose(false)}
              placeholder="O que esta acontecendo?"
              className="w-full resize-none border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none min-h-[60px] text-[15px] leading-relaxed"
              rows={2}
            />
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex gap-1">
                <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all duration-200">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <Button size="sm" disabled={!newPost.trim()} className="shadow-md">
                <Send className="w-4 h-4" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feed Posts */}
      {feedPosts.map((post) => {
        const sportColor = getSportColor(post.sport);
        const roleBadgeVariant = getRoleBadgeVariant(post.user.role);

        return (
          <Card
            key={post.id}
            className="transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar name={post.user.name} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{post.user.name}</span>
                    <Badge variant={roleBadgeVariant} className="text-[10px]">
                      {post.user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{post.timeAgo}</span>
                    <span className="text-slate-300">&middot;</span>
                    {/* Sport badge with colored background */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${sportColor.bg} ${sportColor.text}`}>
                      {post.sport}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-slate-800 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
              {/* Like button with heart fill animation hint on hover */}
              <button
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                  post.isLiked
                    ? "text-red-500 bg-red-50/80"
                    : "text-slate-500 hover:text-red-500 hover:bg-red-50/50"
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    post.isLiked ? "fill-current" : "group-hover:animate-heart-beat"
                  }`}
                />
                <span className="font-medium">{post.likes}</span>
              </button>

              {/* Comment button with count pill */}
              <button
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
                onClick={() => toggleComments(post.id)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[11px] min-w-[20px] text-center">
                  {post.comments}
                </span>
              </button>

              {/* Share button with dropdown */}
              <div className="relative ml-auto">
                <button
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-50/50 transition-all duration-200"
                  onClick={() => toggleShareMenu(post.id)}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Compartilhar</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showShareMenu === post.id ? "rotate-180" : ""}`} />
                </button>

                {/* Share dropdown menu */}
                {showShareMenu === post.id && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 py-1.5 z-10 animate-fade-in">
                    <button className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Copy className="w-4 h-4" />
                      Copiar link
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <Link2 className="w-4 h-4" />
                      Compartilhar externo
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors">
                      <Flag className="w-4 h-4" />
                      Reportar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            {expandedComments.includes(post.id) && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                {post.commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 ml-2">
                    <Avatar name={comment.user.name} size="sm" />
                    <div className="flex-1 border-l-2 border-blue-200 pl-3">
                      <div className="bg-slate-50/80 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">{comment.user.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Comment input */}
                <div className="flex gap-2.5 ml-2 pt-1">
                  <Avatar name="Usuario" size="sm" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Escrever comentario..."
                      className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
                    />
                    <Button size="sm" variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

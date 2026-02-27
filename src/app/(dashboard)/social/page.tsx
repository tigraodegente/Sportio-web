"use client";

import { useState } from "react";
import { Image, Send, Heart, MessageCircle, Share2, MoreHorizontal, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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

export default function SocialPage() {
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Feed</h1>
        <p className="text-slate-500">Veja o que esta acontecendo no mundo esportivo</p>
      </div>

      {/* New Post */}
      <Card>
        <div className="flex gap-3">
          <Avatar name="Usuario" size="md" />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="O que esta acontecendo?"
              className="w-full resize-none border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <Button size="sm" disabled={!newPost.trim()}>
                <Send className="w-4 h-4" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feed Posts */}
      {feedPosts.map((post) => (
        <Card key={post.id}>
          {/* Post Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={post.user.name} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{post.user.name}</span>
                  <Badge variant="default" className="text-[10px]">{post.user.role}</Badge>
                </div>
                <p className="text-xs text-slate-500">{post.timeAgo} &middot; {post.sport}</p>
              </div>
            </div>
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <p className="text-slate-800 mb-4 whitespace-pre-wrap">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
            <button
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                post.isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
              {post.likes}
            </button>
            <button
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
              onClick={() => toggleComments(post.id)}
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </button>
            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>

          {/* Comments */}
          {expandedComments.includes(post.id) && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              {post.commentsList.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar name={comment.user.name} size="sm" />
                  <div className="flex-1 bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900">{comment.user.name}</span>
                      <span className="text-xs text-slate-400">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Avatar name="Usuario" size="sm" />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Escrever comentario..."
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                  />
                  <Button size="sm" variant="ghost">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

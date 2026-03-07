"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, X, Image, FileText, Film } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

type UploadCategory = "avatar" | "post" | "tournament" | "creator" | "chat" | "verification";

interface FileUploadProps {
  category: UploadCategory;
  accept?: string;
  maxSizeMB?: number;
  onUpload: (result: { fileUrl: string; fileKey: string }) => void;
  className?: string;
  label?: string;
  preview?: boolean;
}

export function FileUpload({
  category,
  accept = "image/*",
  maxSizeMB = 10,
  onUpload,
  className = "",
  label = "Arraste ou clique para enviar",
  preview = true,
}: FileUploadProps) {
  const { uploading, progress, error, fileUrl, upload, reset } = useFileUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    // Show preview for images
    if (preview && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    const result = await upload(file, category);
    if (result) {
      onUpload(result);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const getIcon = () => {
    if (accept?.includes("video")) return <Film className="h-8 w-8 text-gray-500" />;
    if (accept?.includes("pdf")) return <FileText className="h-8 w-8 text-gray-500" />;
    return <Image className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className={className}>
      {previewUrl || fileUrl ? (
        <div className="relative">
          <img
            src={previewUrl || fileUrl || ""}
            alt="Preview"
            className="h-40 w-full rounded-lg object-cover"
          />
          <button
            onClick={() => { reset(); setPreviewUrl(null); }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
          }`}
        >
          {uploading ? (
            <>
              <Upload className="h-8 w-8 animate-bounce text-emerald-400" />
              <span className="text-sm text-gray-400">Enviando... {progress}%</span>
              <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              {getIcon()}
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-xs text-gray-600">Max. {maxSizeMB}MB</span>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

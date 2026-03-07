"use client";

import { useState, useCallback } from "react";

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  fileUrl: string | null;
  fileKey: string | null;
}

type UploadCategory = "avatar" | "post" | "tournament" | "creator" | "chat" | "verification";

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    fileUrl: null,
    fileKey: null,
  });

  const upload = useCallback(async (file: File, category: UploadCategory) => {
    setState({ uploading: true, progress: 0, error: null, fileUrl: null, fileKey: null });

    try {
      // Step 1: Get presigned URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          category,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error || "Falha ao preparar upload");
      }

      const { uploadUrl, fileKey, publicUrl } = await presignRes.json();

      setState((prev) => ({ ...prev, progress: 30 }));

      // Step 2: Upload to R2/S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Falha no upload do arquivo");
      }

      setState({
        uploading: false,
        progress: 100,
        error: null,
        fileUrl: publicUrl,
        fileKey,
      });

      return { fileUrl: publicUrl, fileKey };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro no upload";
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null, fileUrl: null, fileKey: null });
  }, []);

  return { ...state, upload, reset };
}

"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGetArquivosQueryKey } from "@/api/generated/endpoints/arquivos/arquivos";
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";
import { UploadDropzone } from "./upload-dropzone";
import { UploadProgressList } from "./upload-progress-list";
import type { UploadItem } from "./upload-progress-item";

function uploadFileWithProgress(
  file: File,
  empresaId: string | undefined,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
    const url = new URL(`${baseUrl}/arquivos/upload`);
    if (empresaId) url.searchParams.set("empresaId", empresaId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url.toString());
    xhr.withCredentials = true;

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload falhou: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Erro de rede")));
    xhr.send(formData);
  });
}

export function ArquivoUploadWidget() {
  const queryClient = useQueryClient();
  const { empresaId } = useEmpresaIdParam();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelected = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();

      setUploads((prev) => [
        { id, fileName: file.name, progress: 0, status: "uploading" },
        ...prev,
      ]);
      setUploading(true);

      try {
        await uploadFileWithProgress(file, empresaId, (pct) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: pct } : u)),
          );
        });

        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress: 100, status: "done" } : u)),
        );

        await queryClient.invalidateQueries({ queryKey: getGetArquivosQueryKey() });
        toast.success(`${file.name} enviado com sucesso`);
      } catch {
        setUploads((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "error" } : u)),
        );
        toast.error(`Erro ao enviar ${file.name}`);
      } finally {
        setUploading(false);
      }
    },
    [empresaId, queryClient],
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Enviar Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadDropzone onFileSelected={handleFileSelected} disabled={uploading} />
        <UploadProgressList uploads={uploads} />
      </CardContent>
    </Card>
  );
}

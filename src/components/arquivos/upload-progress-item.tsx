"use client";

import { CheckCircle, FileText, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: UploadStatus;
}

interface UploadProgressItemProps {
  item: UploadItem;
}

export function UploadProgressItem({ item }: UploadProgressItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{item.fileName}</p>
        <Progress
          value={item.progress}
          className="h-1.5 mt-1"
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">
        {item.progress}%
      </span>
      {item.status === "done" && (
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      )}
      {item.status === "error" && (
        <XCircle className="h-4 w-4 text-destructive shrink-0" />
      )}
      {item.status === "uploading" && (
        <div className="h-4 w-4 shrink-0" />
      )}
    </div>
  );
}

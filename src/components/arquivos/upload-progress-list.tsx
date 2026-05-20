"use client";

import { UploadProgressItem } from "./upload-progress-item";
import type { UploadItem } from "./upload-progress-item";

interface UploadProgressListProps {
  uploads: UploadItem[];
}

export function UploadProgressList({ uploads }: UploadProgressListProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="mt-4 divide-y divide-border rounded-md border px-4">
      {uploads.map((item) => (
        <UploadProgressItem key={item.id} item={item} />
      ))}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { formatFileSize } from "@/lib/product-display";
import { cn } from "@/lib/cn";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function validateFile(file: File): string | null {
  const fileName = file.name.toLowerCase();
  const isValidType =
    fileName.endsWith(".csv") || fileName.endsWith(".xlsx");

  if (!isValidType) {
    return "Only .csv and .xlsx files are allowed";
  }

  if (file.size === 0) {
    return "File is empty";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File must be 10MB or smaller";
  }

  return null;
}

export function UploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    applyFile(event.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      setError(selectedFile ? "" : "Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    setError("");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        error?: string;
        importId?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      if (data.importId) {
        router.push(`/imports/${data.importId}`);
        router.refresh();
        return;
      }

      setError("Upload succeeded but no import was returned");
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const fileType = selectedFile
    ? selectedFile.name.toLowerCase().endsWith(".xlsx")
      ? "XLSX"
      : "CSV"
    : null;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border border-dashed bg-surface px-6 py-10 text-center",
          isDragging ? "border-accent bg-accent-soft" : "border-border",
        )}
      >
        <p className="text-sm font-medium">Drop CSV or XLSX here</p>
        <p className="mt-1 text-sm text-muted">or</p>
        <button
          type="button"
          className="mt-3 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-muted"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile ? (
        <div className="flex items-start justify-between rounded-lg border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted">
              {fileType} · {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-muted hover:text-foreground"
            onClick={() => {
              setSelectedFile(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          >
            Remove
          </button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-failed">{error}</p> : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "Starting..." : "Start Processing"}
      </button>
    </div>
  );
}

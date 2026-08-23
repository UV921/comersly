"use client";

import { useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const validUpload = (file: File) => {
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
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validUpload(file);

    if (validationError) {
      setError(validationError);
      setSuccess("");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        error?: string;
        rowCount?: number;
      };

      if (!response.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      setSuccess(`Imported ${data.rowCount ?? 0} rows`);
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload page</h1>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
      />

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {selectedFile && <p>Selected: {selectedFile.name}</p>}

      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

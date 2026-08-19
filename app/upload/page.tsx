"use client";

import { useState, type ChangeEvent } from "react";

export default function Uploadpage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const validUpload = (file: File) => {
    const fileName = file.name.toLowerCase();

    const isValidType =
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx");

    if (!isValidType) {
      return "Only .csv and .xlsx files are allowed";
    }

    if (file.size === 0) {
      return "File is empty";
    }

    return null;
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validationError = validUpload(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
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

      {selectedFile && (
        <p>Selected: {selectedFile.name}</p>
      )}
    </div>
  );
}
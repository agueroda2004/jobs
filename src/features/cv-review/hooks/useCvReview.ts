import { useEffect, useState } from "react";
import { reviewCv } from "../services/geminiService";
import type { CvReviewResult, StoredCv } from "../types";

const STORAGE_KEY = "jobs:stored-cv";

export function useCvReview() {
  const [cv, setCv] = useState<StoredCv | null>(() => readStoredCv());
  const [result, setResult] = useState<CvReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cv) localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
  }, [cv]);

  async function saveCv(file: File) {
    if (file.type !== "application/pdf") throw new Error("Solo se aceptan archivos PDF.");
    const dataUrl = await readFile(file);
    setCv({ name: file.name, type: file.type, dataUrl, updatedAt: new Date().toISOString() });
    setResult(null);
    setError("");
  }

  async function analyze(apiKey: string, jobDescription: string) {
    if (!cv) return;
    setLoading(true);
    setError("");
    try {
      setResult(await reviewCv(apiKey.trim(), cv, jobDescription.trim()));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo analizar el CV.");
    } finally {
      setLoading(false);
    }
  }

  return { cv, result, loading, error, saveCv, analyze };
}

function readStoredCv(): StoredCv | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredCv) : null;
  } catch {
    return null;
  }
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo PDF."));
    reader.readAsDataURL(file);
  });
}

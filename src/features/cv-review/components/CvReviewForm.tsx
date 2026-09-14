import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { StoredCv } from "../types";

interface CvReviewFormProps {
  cv: StoredCv | null;
  loading: boolean;
  onFileChange: (file: File) => Promise<void>;
  onAnalyze: (apiKey: string, jobDescription: string) => Promise<void>;
}

export default function CvReviewForm({
  cv,
  loading,
  onFileChange,
  onAnalyze,
}: CvReviewFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileError, setFileError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileError("");
    try {
      await onFileChange(file);
    } catch (reason) {
      setFileError(reason instanceof Error ? reason.message : "No se pudo cargar el PDF.");
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void onAnalyze(apiKey, jobDescription);
  }

  const canSubmit = Boolean(cv && apiKey.trim() && jobDescription.trim() && !loading);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cv-file" className="mb-2 block text-sm font-semibold text-neutral-800">
          CV en PDF
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-8 text-center transition hover:border-neutral-900 hover:bg-white">
          <span className="text-sm font-semibold text-neutral-800">
            {cv ? "Actualizar CV" : "Carga tu CV"}
          </span>
          <span className="mt-1 text-xs text-neutral-500">Solo archivos PDF</span>
          <input id="cv-file" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="sr-only" />
        </label>
        {cv && (
          <p className="mt-2 truncate text-xs text-neutral-500">
            CV guardado: <span className="font-medium text-neutral-800">{cv.name}</span>
          </p>
        )}
        {fileError && <p className="mt-2 text-xs font-medium text-red-600">{fileError}</p>}
      </div>

      <div>
        <label htmlFor="api-key" className="mb-2 block text-sm font-semibold text-neutral-800">
          API key de Google AI Studio
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="AIza..."
          autoComplete="off"
          className="h-11 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />
        <p className="mt-2 text-xs text-neutral-500">No se guarda en el navegador.</p>
      </div>

      <div>
        <label htmlFor="job-description" className="mb-2 block text-sm font-semibold text-neutral-800">
          Descripción del empleo
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Pega aquí la descripción completa de la oferta..."
          rows={10}
          className="w-full resize-y rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analizando CV..." : "Analizar compatibilidad"}
      </button>
    </form>
  );
}

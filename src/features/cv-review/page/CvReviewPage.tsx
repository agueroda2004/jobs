import { useCvReview } from "../hooks/useCvReview";
import CvReviewForm from "../components/CvReviewForm";
import CvReviewResult from "../components/CvReviewResult";
import AppShell from "../../../components/AppShell";

export default function CvReviewPage() {
  const { cv, result, loading, error, saveCv, analyze } = useCvReview();
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Revisión inteligente</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Analiza tu CV frente a una oferta</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Obtén un match, detecta gaps y recibe cambios concretos para mejorar tu candidatura.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-bold">Datos del análisis</h2>
          <CvReviewForm cv={cv} loading={loading} onFileChange={saveCv} onAnalyze={analyze} />
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</p>}
        </section>
        <CvReviewResult result={result} />
        </div>
      </main>
    </AppShell>
  );
}

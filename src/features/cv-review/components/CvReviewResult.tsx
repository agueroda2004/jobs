import type { CvReviewResult } from "../types";
import MarkdownText from "./MarkdownText";

const recommendationLabels = {
  apply: "Aplicar",
  improve_cv: "Mejorar CV",
  skip: "Omitir",
} as const;

export default function CvReviewResult({ result }: { result: CvReviewResult | null }) {
  if (!result) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
        <div>
          <p className="text-sm font-semibold text-neutral-700">Tu revisión aparecerá aquí</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Carga tu CV, añade la oferta y ejecuta el análisis para ver el match y las recomendaciones.
          </p>
        </div>
      </div>
    );
  }

  const recommendationClass = {
    apply: "bg-emerald-100 text-emerald-800",
    improve_cv: "bg-amber-100 text-amber-800",
    skip: "bg-red-100 text-red-800",
  }[result.recommendation];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">Match con la oferta</p>
            <p className="mt-1 text-5xl font-bold tracking-tight text-neutral-900">{result.matchPercentage}%</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${recommendationClass}`}>
            {recommendationLabels[result.recommendation]}
          </span>
        </div>
        <p className="mt-5 text-sm leading-6 text-neutral-700"><MarkdownText text={result.summary} /></p>
      </section>

      <ResultSection title="Gaps existentes">
        {result.gaps.length ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
            {result.gaps.map((gap, index) => <li key={`${gap}-${index}`}><MarkdownText text={gap} /></li>)}
          </ul>
        ) : <p className="text-sm text-neutral-500">No se detectaron gaps relevantes.</p>}
      </ResultSection>

      {result.recommendation === "improve_cv" && (
        <ResultSection title="Cambios sugeridos">
          <div className="space-y-4">
            {result.improvements.map((improvement, index) => (
              <div key={`${improvement.section}-${index}`} className="rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">{improvement.section}</p>
                <div className="mt-3 space-y-3 text-sm leading-6">
                  <p><span className="font-semibold text-red-700">Cambia:</span> <MarkdownText text={improvement.currentText} /></p>
                  <p><span className="font-semibold text-emerald-700">Por:</span> <MarkdownText text={improvement.suggestedText} /></p>
                  <p className="text-neutral-500"><MarkdownText text={improvement.reason} /></p>
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
      )}
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}

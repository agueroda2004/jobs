import type { CvReviewResult } from "../types";

const MODEL = "gemini-3.8-flash";
const ENDPOINT = "/api/cv-review";

const REVIEW_PROMPT = `
Analiza el CV adjunto en PDF frente a la descripción del empleo.
Devuelve exclusivamente un JSON válido, sin markdown ni texto adicional, con esta estructura exacta:
{
  "matchPercentage": number,
  "recommendation": "apply" | "improve_cv" | "skip",
  "summary": string,
  "gaps": string[],
  "improvements": [{
    "section": string,
    "currentText": string,
    "suggestedText": string,
    "reason": string
  }]
}

Reglas:
- matchPercentage debe ser un número entero entre 0 y 100.
- Usa recommendation "apply" si el match es alto, "improve_cv" si hay oportunidades concretas de mejora y "skip" si el perfil no encaja.
- Identifica gaps reales entre el CV y la oferta, sin inventar experiencia.
- Si recommendation es "improve_cv", incluye cambios concretos en improvements con formato de reemplazo: texto actual y texto sugerido.
- En suggestedText escribe la frase completa con texto normal. Usa **doble asterisco únicamente alrededor de 1 a 3 fragmentos importantes**, como una tecnología, acción, métrica o resultado. Nunca envuelvas toda la frase o todo el bullet en **doble asterisco**.
- Usa el mismo criterio de énfasis en summary, gaps, currentText y reason: marca solo fragmentos puntuales, nunca párrafos completos.
- Responde en español.

Descripción del empleo:
`;

export async function reviewCv(
  apiKey: string,
  cv: { dataUrl: string; type: string },
  jobDescription: string,
): Promise<CvReviewResult> {
  const base64 = cv.dataUrl.split(",")[1];
  if (!base64)
    throw new Error("El archivo del CV no tiene un contenido válido.");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      model: MODEL,
      store: false,
      input: [
        { type: "text", text: `${REVIEW_PROMPT}\n${jobDescription}` },
        { type: "document", data: base64, mime_type: cv.type },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: REVIEW_SCHEMA,
      },
      generation_config: {
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      error?.error?.message ?? `Error de Gemini (${response.status}).`,
    );
  }

  const data = (await response.json()) as {
    status?: string;
    steps?: {
      type?: string;
      content?: { type?: string; text?: string }[];
    }[];
    error?: { message?: string };
  };

  if (data.status === "failed") {
    throw new Error(
      data.error?.message ?? "Gemini no pudo completar el análisis.",
    );
  }

  const text = data.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .find((content) => content.type === "text")?.text;

  if (!text) throw new Error("Gemini no devolvió una respuesta válida.");

  try {
    return normalizeResult(JSON.parse(text) as Partial<CvReviewResult>);
  } catch {
    throw new Error("La respuesta de Gemini no tiene el formato esperado.");
  }
}

const REVIEW_SCHEMA = {
  type: "object",
  properties: {
    matchPercentage: {
      type: "integer",
      description: "Match del CV con la oferta entre 0 y 100.",
    },
    recommendation: {
      type: "string",
      enum: ["apply", "improve_cv", "skip"],
      description: "Recomendación final para la candidatura.",
    },
    summary: { type: "string", description: "Resumen ejecutivo del análisis." },
    gaps: {
      type: "array",
      items: { type: "string" },
      description: "Gaps reales entre el CV y la oferta.",
    },
    improvements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          section: { type: "string" },
          currentText: { type: "string" },
          suggestedText: { type: "string" },
          reason: { type: "string" },
        },
        required: ["section", "currentText", "suggestedText", "reason"],
      },
    },
  },
  required: [
    "matchPercentage",
    "recommendation",
    "summary",
    "gaps",
    "improvements",
  ],
} as const;

function normalizeResult(result: Partial<CvReviewResult>): CvReviewResult {
  const recommendation = result.recommendation;
  return {
    matchPercentage: Math.max(
      0,
      Math.min(100, Number(result.matchPercentage) || 0),
    ),
    recommendation:
      recommendation === "apply" ||
      recommendation === "skip" ||
      recommendation === "improve_cv"
        ? recommendation
        : "improve_cv",
    summary: result.summary ?? "No se recibió un resumen.",
    gaps: Array.isArray(result.gaps) ? result.gaps : [],
    improvements: Array.isArray(result.improvements)
      ? result.improvements.map((improvement) => ({
          ...improvement,
          suggestedText: removeOuterBold(improvement.suggestedText),
        }))
      : [],
  };
}

function removeOuterBold(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    const inner = trimmed.slice(2, -2);
    if (!inner.includes("**")) return inner;
  }
  return text;
}

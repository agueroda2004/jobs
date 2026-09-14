import { withErrors } from "../lib/http";

export const config = { runtime: "edge" };

type ReviewProxyBody = {
  apiKey?: unknown;
  model?: unknown;
  store?: unknown;
  input?: unknown;
  response_format?: unknown;
  generation_config?: unknown;
};

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const API_REVISION = "2026-05-20";

export default withErrors(async function handler(req: Request) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = (await req.json().catch(() => null)) as ReviewProxyBody | null;
  if (!body || typeof body.apiKey !== "string" || !body.apiKey.trim()) {
    return Response.json({ error: "A valid Gemini API key is required" }, { status: 400 });
  }

  if (body.model !== "gemini-3.8-flash" || !Array.isArray(body.input)) {
    return Response.json({ error: "Invalid Gemini interaction payload" }, { status: 400 });
  }

  const { apiKey, ...interaction } = body;
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "Api-Revision": API_REVISION,
    },
    body: JSON.stringify(interaction),
  });

  const data = await response.json().catch(() => ({
    error: { message: "Gemini returned an invalid response" },
  }));

  return Response.json(data, { status: response.status });
});

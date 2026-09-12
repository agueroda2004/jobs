import type { Application } from "../../types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    let message = `API error ${response.status}: ${response.statusText}`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = `${message} - ${data.error}`;
    } catch {
      // Keep the status fallback when the response is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getState: () => request<{ applications: Application[] }>("/state"),
  getApplications: () => request<Application[]>("/applications"),
  createApplication: (data: Application) =>
    request<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateApplication: (id: string, data: Partial<Application>) =>
    request<Application>("/applications", {
      method: "PATCH",
      body: JSON.stringify({ id, ...data }),
    }),
  deleteApplication: (id: string) =>
    request<{ ok: true }>("/applications", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }),
};

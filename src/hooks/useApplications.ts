import { useEffect, useState } from "react";
import type { Application } from "../types";
import { STORAGE_KEY } from "../constants/statuses";

function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((app) => ({ position: "", ...app }));
  } catch {
    return [];
  }
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(loadApplications);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // storage may be unavailable; keep in-memory state
    }
  }, [applications]);

  const createApplication = (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const app: Application = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setApplications((prev) => [app, ...prev]);
    return app;
  };

  const updateApplication = (
    id: string,
    data: Partial<Omit<Application, "id" | "createdAt" | "updatedAt">>,
  ) => {
    let updated: Application | undefined;
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        updated = { ...app, ...data, updatedAt: Date.now() };
        return updated;
      }),
    );
    return updated;
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return {
    applications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}
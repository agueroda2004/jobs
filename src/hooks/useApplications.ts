import { useEffect, useState } from "react";
import type { Application } from "../types";
import { api } from "../shared/api/client";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .getState()
      .then((data) => {
        if (!cancelled) setApplications(data.applications);
      })
      .catch((error: unknown) => {
        console.error("Failed to load applications:", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const createApplication = (
    data: Omit<Application, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const application: Application = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    setApplications((previous) => [application, ...previous]);
    void api.createApplication(application).catch((error: unknown) => {
      console.error("Failed to create application:", error);
    });
    return application;
  };

  const updateApplication = (
    id: string,
    data: Partial<Omit<Application, "id" | "createdAt" | "updatedAt">>,
  ) => {
    const updatedAt = new Date().toISOString();
    const current = applications.find((application) => application.id === id);
    const updated = current ? { ...current, ...data, updatedAt } : undefined;

    setApplications((previous) =>
      previous.map((application) => {
        if (application.id !== id) return application;
        return updated ?? application;
      }),
    );

    if (updated) {
      void api.updateApplication(id, updated).catch((error: unknown) => {
        console.error("Failed to update application:", error);
      });
    }

    return updated;
  };

  const deleteApplication = (id: string) => {
    setApplications((previous) => previous.filter((application) => application.id !== id));
    void api.deleteApplication(id).catch((error: unknown) => {
      console.error("Failed to delete application:", error);
    });
  };

  return {
    applications,
    loading,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}

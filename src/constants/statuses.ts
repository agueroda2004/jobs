import type { ApplicationStatus } from "../types";

export interface StatusConfig {
  label: string;
  badge: string;
  dot: string;
  selectOption: string;
}

export const STATUSES: Record<ApplicationStatus, StatusConfig> = {
  enviada: {
    label: "Enviada",
    badge: "bg-zinc-100 text-zinc-700 ring-zinc-300",
    dot: "bg-zinc-500",
    selectOption: "bg-zinc-100 text-zinc-700",
  },
  en_revision: {
    label: "En revisión",
    badge: "bg-blue-50 text-blue-700 ring-blue-300",
    dot: "bg-blue-500",
    selectOption: "bg-blue-50 text-blue-700",
  },
  entrevista: {
    label: "Entrevista",
    badge: "bg-amber-50 text-amber-700 ring-amber-300",
    dot: "bg-amber-500",
    selectOption: "bg-amber-50 text-amber-700",
  },
  oferta: {
    label: "Oferta",
    badge: "bg-green-50 text-green-700 ring-green-300",
    dot: "bg-green-500",
    selectOption: "bg-green-50 text-green-700",
  },
  rechazada: {
    label: "Rechazada",
    badge: "bg-red-50 text-red-700 ring-red-300",
    dot: "bg-red-500",
    selectOption: "bg-red-50 text-red-700",
  },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "enviada",
  "en_revision",
  "entrevista",
  "oferta",
  "rechazada",
];

export const DEFAULT_STATUS: ApplicationStatus = "enviada";

export const STORAGE_KEY = "jobs-applications";

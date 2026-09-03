export type ApplicationStatus =
  | "enviada"
  | "en_revision"
  | "entrevista"
  | "oferta"
  | "rechazada";

export interface Application {
  id: string;
  company: string;
  date: string;
  status: ApplicationStatus;
  url: string;
  createdAt: number;
  updatedAt: number;
}

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}
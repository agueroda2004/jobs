import { useState } from "react";
import type { Application, ApplicationStatus } from "../types";
import { DEFAULT_STATUS } from "../constants/statuses";
import { toISO } from "../utils/date";
import DatePicker from "./ui/DatePicker";
import StatusSelect from "./ui/StatusSelect";

interface ApplicationFormProps {
  initial?: Application;
  onSubmit: (data: {
    company: string;
    date: string;
    status: ApplicationStatus;
    url: string;
  }) => void;
}

interface Errors {
  company?: string;
  date?: string;
  url?: string;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ApplicationForm({ initial, onSubmit }: ApplicationFormProps) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [date, setDate] = useState(initial?.date ?? toISO(new Date()));
  const [status, setStatus] = useState<ApplicationStatus>(
    initial?.status ?? DEFAULT_STATUS,
  );
  const [url, setUrl] = useState(initial?.url ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!company.trim()) next.company = "El nombre de la empresa es obligatorio.";
    if (!date) next.date = "La fecha de aplicación es obligatoria.";
    if (url.trim() && !isValidUrl(url.trim())) {
      next.url = "Ingresa una URL válida (debe comenzar con http:// o https://).";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      company: company.trim(),
      date,
      status,
      url: url.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label
          htmlFor="company"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Empresa
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Ej. Acme Corp"
          className={`h-11 w-full rounded-xl border-2 bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 ${
            errors.company
              ? "border-red-400 focus:border-red-500"
              : "border-neutral-200 hover:border-neutral-300 focus:border-neutral-900"
          }`}
        />
        {errors.company && (
          <p className="mt-1.5 text-xs text-red-600">{errors.company}</p>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-neutral-700">
          Fecha de aplicación
        </span>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="Seleccionar fecha"
          inline
        />
        {errors.date && (
          <p className="mt-1.5 text-xs text-red-600">{errors.date}</p>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-neutral-700">
          Estado
        </span>
        <StatusSelect value={status} onChange={setStatus} inline />
      </div>

      <div>
        <label
          htmlFor="url"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          URL de la postulación
          <span className="ml-1 text-neutral-400">(opcional)</span>
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={`h-11 w-full rounded-xl border-2 bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 ${
            errors.url
              ? "border-red-400 focus:border-red-500"
              : "border-neutral-200 hover:border-neutral-300 focus:border-neutral-900"
          }`}
        />
        {errors.url && <p className="mt-1.5 text-xs text-red-600">{errors.url}</p>}
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          {initial ? "Guardar cambios" : "Registrar postulación"}
        </button>
      </div>
    </form>
  );
}
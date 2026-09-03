import type { Application, ApplicationStatus } from "../types";
import { formatLongDate } from "../utils/date";
import StatusSelect from "./ui/StatusSelect";
import { EditIcon, ExternalLinkIcon, TrashIcon } from "./ui/icons";

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export default function ApplicationCard({
  application,
  onStatusChange,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-neutral-900">
            {application.company}
          </h3>
          <StatusSelect
            value={application.status}
            onChange={(status) => onStatusChange(application.id, status)}
            compact
          />
        </div>
        {application.position && (
          <p className="mt-0.5 truncate text-sm font-medium text-neutral-600">
            {application.position}
          </p>
        )}
        <p className="mt-1.5 text-sm text-neutral-500">
          Aplicaste el {formatLongDate(application.date)}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:shrink-0">
        {application.url && (
          <a
            href={application.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Ver oferta
          </a>
        )}
        <button
          type="button"
          onClick={() => onEdit(application)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
          aria-label={`Editar postulación de ${application.company}`}
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(application)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 text-neutral-600 transition hover:border-red-600 hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar postulación de ${application.company}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
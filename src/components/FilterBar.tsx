import type { ApplicationStatus } from "../types";
import { STATUSES, STATUS_ORDER } from "../constants/statuses";
import { ChevronUpDownIcon, SearchIcon } from "./ui/icons";

export type StatusFilter = ApplicationStatus | "todas";
export type SortOrder = "asc" | "desc";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
  counts: Record<ApplicationStatus, number>;
}

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sort,
  onSortChange,
  counts,
}: FilterBarProps) {
  const total = Object.values(counts).reduce((acc, n) => acc + n, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company..."
            className="h-11 w-full rounded-xl border-2 border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={() => onSortChange(sort === "asc" ? "desc" : "asc")}
          className="flex h-11 items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-300"
        >
          <ChevronUpDownIcon className="h-4 w-4 text-neutral-500" />
          {sort === "asc" ? "Oldest" : "Newest"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onStatusFilterChange("todas")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
            statusFilter === "todas"
              ? "bg-neutral-900 text-white ring-neutral-900"
              : "bg-white text-neutral-600 ring-neutral-300 hover:bg-neutral-50"
          }`}
        >
          All ({total})
        </button>
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusFilterChange(status)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
              statusFilter === status
                ? `${STATUSES[status].badge} ring-1`
                : "bg-white text-neutral-600 ring-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${STATUSES[status].dot}`} />
            {STATUSES[status].label} ({counts[status]})
          </button>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import type { ApplicationStatus } from "../../types";
import { STATUSES, STATUS_ORDER } from "../../constants/statuses";
import { ChevronUpDownIcon, CheckIcon } from "./icons";

interface StatusSelectProps {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  inline?: boolean;
  compact?: boolean;
}

export default function StatusSelect({
  value,
  onChange,
  inline = false,
  compact = false,
}: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = STATUSES[value];

  return (
    <div ref={ref} className={inline ? undefined : "relative"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded-full bg-white/70 ring-1 ring-inset ring-neutral-300 transition hover:bg-white"
            : `flex h-11 w-full items-center justify-between rounded-xl border-2 border-neutral-200 bg-white px-4 text-sm outline-none transition hover:border-neutral-300 ${
                open ? "border-neutral-900" : ""
              }`
        }
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${selected.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${selected.dot}`} />
          {selected.label}
        </span>
        <ChevronUpDownIcon
          className={compact ? "h-3.5 w-3.5 text-neutral-400" : "h-4 w-4 text-neutral-400"}
        />
      </button>

      {open && (
        <div
          className={`${
            inline ? "mt-1" : "absolute left-0 top-full z-30 mt-1"
          } min-w-[13rem] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl`}
        >
          {STATUS_ORDER.map((status) => {
            const config = STATUSES[status];
            const isSelected = status === value;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                  isSelected
                    ? `${config.selectOption}`
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className={`h-4 w-4 shrink-0 rounded-md ${config.dot}`} />
                <span className="flex-1 text-left">{config.label}</span>
                {isSelected && <CheckIcon className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
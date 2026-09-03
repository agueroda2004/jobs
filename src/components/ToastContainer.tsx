import type { ToastItem, ToastType } from "../types";
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from "./ui/icons";

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<ToastType, { container: string; icon: string; Icon: typeof CheckIcon }> = {
  success: {
    container: "border-emerald-200 bg-white",
    icon: "text-emerald-600",
    Icon: CheckIcon,
  },
  error: {
    container: "border-red-200 bg-white",
    icon: "text-red-600",
    Icon: AlertIcon,
  },
  info: {
    container: "border-neutral-200 bg-white",
    icon: "text-neutral-600",
    Icon: InfoIcon,
  },
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const { container, icon, Icon } = TOAST_STYLES[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg animate-[toast-in_0.2s_ease-out] ${container}`}
            role="status"
          >
            <span className={`mt-0.5 ${icon}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="flex-1 text-sm font-medium text-neutral-800">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Cerrar notificación"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../shared/auth";
import { LogOutIcon } from "./ui/icons";

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-20 items-center border-b border-neutral-200 px-6">
          <span className="text-xl font-bold tracking-tight">Jobs</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Main navigation">
          <NavigationLinks />
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900">
            <LogOutIcon className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <nav className="border-b border-neutral-200 bg-white lg:hidden" aria-label="Mobile navigation">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4">
            <span className="shrink-0 text-lg font-bold tracking-tight">Jobs</span>
            <div className="flex items-center gap-1">
              <NavigationLinks compact />
              <button type="button" onClick={handleLogout} aria-label="Cerrar sesión" className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900">
                <LogOutIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>

        <header className="hidden h-20 border-b border-neutral-200 bg-white lg:block" aria-label="Page header" />
        {children}
      </div>
    </div>
  );
}

function NavigationLinks({ compact = false }: { compact?: boolean }) {
  const base = compact ? "rounded-lg px-2 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm" : "rounded-xl px-3 py-2.5 text-sm font-semibold transition";
  return (
    <>
      <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}>
        Postulaciones
      </NavLink>
      <NavLink to="/cv-review" className={({ isActive }) => `${base} ${isActive ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}>
        Revisar CV
      </NavLink>
    </>
  );
}

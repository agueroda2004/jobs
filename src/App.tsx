import { useMemo, useState } from "react";
import type { Application, ApplicationStatus } from "./types";
import { HashRouter, Route, Routes } from "react-router-dom";
import { STATUSES, STATUS_ORDER } from "./constants/statuses";
import { useApplications } from "./hooks/useApplications";
import { useToast } from "./hooks/useToast";
import AuthGuard from "./features/auth/components/AuthGuard";
import LoginPage from "./features/auth/page/LoginPage";
import FilterBar, {
  type SortOrder,
  type StatusFilter,
} from "./components/FilterBar";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import ToastContainer from "./components/ToastContainer";
import Modal from "./components/ui/Modal";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import Pagination from "./components/ui/Pagination";
import { PlusIcon } from "./components/ui/icons";
import CvReviewPage from "./features/cv-review/page/CvReviewPage";
import AppShell from "./components/AppShell";

const PAGE_SIZE = 20;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/cv-review"
          element={
            <AuthGuard>
              <CvReviewPage />
            </AuthGuard>
          }
        />
        <Route
          path="*"
          element={
            <AuthGuard>
              <Jobs />
            </AuthGuard>
          }
        />
      </Routes>
    </HashRouter>
  );
}

function Jobs() {
  const {
    applications,
    createApplication,
    updateApplication,
    deleteApplication,
    loading,
  } = useApplications();
  const { toasts, show, dismiss } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const [sort, setSort] = useState<SortOrder>("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Application | undefined>(undefined);
  const [deleting, setDeleting] = useState<Application | undefined>(undefined);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const base = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<
      ApplicationStatus,
      number
    >;
    for (const app of applications) base[app.status] += 1;
    return base;
  }, [applications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = applications.filter((app) => {
      if (statusFilter !== "todas" && app.status !== statusFilter) return false;
      if (q && !app.company.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sort === "asc" ? diff : -diff;
    });
  }, [applications, search, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500">
        Loading applications...
      </div>
    );
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSortChange(value: SortOrder) {
    setSort(value);
    setPage(1);
  }

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(application: Application) {
    setEditing(application);
    setFormOpen(true);
  }

  function handleSubmit(data: {
    company: string;
    position: string;
    date: string;
    status: ApplicationStatus;
    url: string;
  }) {
    if (editing) {
      updateApplication(editing.id, data);
      show("success", `Application for ${data.company} updated`);
    } else {
      createApplication(data);
      show("success", `Application for ${data.company} registered`);
    }
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleStatusChange(id: string, status: ApplicationStatus) {
    updateApplication(id, { status });
    show("success", `Status updated to ${STATUSES[status].label}`);
  }

  function handleDelete() {
    if (!deleting) return;
    deleteApplication(deleting.id);
    show("success", `Application for ${deleting.company} deleted`);
    setDeleting(undefined);
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <FilterBar
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            sort={sort}
            onSortChange={handleSortChange}
            counts={counts}
          />
        </section>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
              <PlusIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                No applications yet
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Register your first application to start tracking your job
                search.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              Register application
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <h2 className="text-base font-semibold text-neutral-900">
              No results
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              No applications match the current filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-neutral-500">
              {filtered.length}{" "}
              {filtered.length === 1 ? "application" : "applications"}
            </p>
            {visibleItems.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onStatusChange={handleStatusChange}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </main>

      <Modal
        open={formOpen}
        title={editing ? "Edit application" : "New application"}
        onClose={() => {
          setFormOpen(false);
          setEditing(undefined);
        }}
      >
        <ApplicationForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== undefined}
        title="Delete application"
        message={
          deleting
            ? `Are you sure you want to delete the application for ${deleting.company}? This action cannot be undone.`
            : ""
        }
        onCancel={() => setDeleting(undefined)}
        onConfirm={handleDelete}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </AppShell>
  );
}

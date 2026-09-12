const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toDate(iso: string): Date | null {
  if (!iso) return null;
  const datePart = iso.includes("T") ? iso.split("T")[0] : iso;
  const d = new Date(`${datePart}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatLongDate(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
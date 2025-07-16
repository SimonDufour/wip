export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDatePrecise(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr", {
    minute: "numeric",
    hour: "numeric",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

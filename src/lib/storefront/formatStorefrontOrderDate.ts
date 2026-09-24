const malaysiaTimeZone = "Asia/Kuala_Lumpur";

export function formatStorefrontOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: malaysiaTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatStorefrontOrderDateTime(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: malaysiaTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
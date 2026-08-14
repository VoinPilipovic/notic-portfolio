import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number as EUR currency with tabular-friendly grouping - used
 * by the NOTIC PAY experience (src/components/{card,cards,dashboard,
 * transfer,analytics,savings}/**). */
export function formatCurrency(amount: number, options?: { signed?: boolean }) {
  const formatted = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (!options?.signed) return formatted;
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

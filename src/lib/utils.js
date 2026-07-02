import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPriceDisplay(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numericValue);
}

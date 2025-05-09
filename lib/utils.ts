import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency with appropriate abbreviations for large numbers
export function formatCurrency(value: number): string {
  if (!value && value !== 0) return "N/A"

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  if (value >= 1e9) {
    return formatter.format(value / 1e9) + "B"
  } else if (value >= 1e6) {
    return formatter.format(value / 1e6) + "M"
  } else if (value >= 1e3) {
    return formatter.format(value / 1e3) + "K"
  } else if (value < 0.01 && value > 0) {
    return "$" + value.toFixed(6)
  }

  return formatter.format(value)
}

// Format percentage with appropriate sign and decimal places
export function formatPercentage(value: number): string {
  if (!value && value !== 0) return "N/A"

  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never",
  })

  return formatter.format(value / 100)
}

// Format large numbers with appropriate abbreviations
export function formatNumber(value: number): string {
  if (!value && value !== 0) return "N/A"

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  })

  if (value >= 1e9) {
    return formatter.format(value / 1e9) + "B"
  } else if (value >= 1e6) {
    return formatter.format(value / 1e6) + "M"
  } else if (value >= 1e3) {
    return formatter.format(value / 1e3) + "K"
  }

  return formatter.format(value)
}

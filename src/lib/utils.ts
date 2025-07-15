import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a percentage string with 0 decimals (e.g., 18.7 -> '19%').
 * Accepts values from 0-100, or -100 to 100 for mood.
 */
export function formatPercentage(value: number, options?: { signed?: boolean }) {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  const rounded = Math.round(value);
  if (options?.signed) {
    return `${rounded > 0 ? '+' : ''}${rounded}%`;
  }
  return `${rounded}%`;
}

/**
 * Generates a stable hash value from a string input.
 * Used to replace Math.random() calls with deterministic values.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a stable value between min and max based on a seed string.
 * Replaces Math.random() calls for consistent UI behavior.
 */
export function stableValue(seed: string, min: number, max: number): number {
  const hash = hashString(seed);
  return min + (hash % (max - min + 1));
}

/**
 * Generates a stable percentage value (0-100) based on a seed string.
 */
export function stablePercentage(seed: string): number {
  return stableValue(seed, 0, 100);
}

/**
 * Generates a stable mood value (-100 to 100) based on a seed string.
 */
export function stableMood(seed: string): number {
  return stableValue(seed, -100, 100);
}

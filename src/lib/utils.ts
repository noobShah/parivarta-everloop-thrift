import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a marketplace link with a URL-encoded category query parameter.
 * Use this to avoid issues when category names contain spaces or ampersands.
 */
export function categoryLink(category: string) {
  return `/marketplace?category=${encodeURIComponent(category)}`;
}

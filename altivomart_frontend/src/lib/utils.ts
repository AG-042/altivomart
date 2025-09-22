import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaURL(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN || 'https://api.altivomart.com';
  if (url.startsWith('/')) return `${origin}${url}`;
  return `${origin}/${url}`;
}

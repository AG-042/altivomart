import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaURL(url?: string | null): string | null {
  if (!url) return null;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Use development Django server by default
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://127.0.0.1:8000';
  
  // Handle different URL formats
  if (url.startsWith('/media/')) return `${origin}${url}`;
  if (url.startsWith('media/')) return `${origin}/${url}`;
  if (url.startsWith('/')) return `${origin}${url}`;
  
  // Default case - assume it needs /media/ prefix
  return `${origin}/media/${url}`;
}

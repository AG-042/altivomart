import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mediaURL(url?: string | null): string | null {
  if (!url) return null;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Get the API origin, fallback to API URL without /api suffix
  let origin = process.env.NEXT_PUBLIC_API_ORIGIN;
  
  if (!origin && process.env.NEXT_PUBLIC_API_URL) {
    // Extract origin from NEXT_PUBLIC_API_URL by removing /api suffix
    origin = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  }
  
  // Final fallback for development
  if (!origin) {
    origin = 'http://127.0.0.1:8000';
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('mediaURL debug:', { url, origin, apiUrl: process.env.NEXT_PUBLIC_API_URL });
  }
  
  // Handle different URL formats
  if (url.startsWith('/media/')) return `${origin}${url}`;
  if (url.startsWith('media/')) return `${origin}/${url}`;
  if (url.startsWith('/')) return `${origin}${url}`;
  
  // Default case - assume it needs /media/ prefix
  return `${origin}/media/${url}`;
}

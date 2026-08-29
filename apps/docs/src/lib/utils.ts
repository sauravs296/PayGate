import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  let url = "http://localhost:3000";
  if (process.env.NEXT_PUBLIC_APP_URL) {
    url = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  } else if (process.env.VERCEL_URL) {
    url = process.env.VERCEL_URL;
  }

  url = url.replace(/\/$/, "");
  if (!url.startsWith("http")) {
    url = url.includes("localhost") ? `http://${url}` : `https://${url}`;
  }
  
  return url;
}

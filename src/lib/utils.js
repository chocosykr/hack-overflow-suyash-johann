import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const priorityStyles = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-200",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  EMERGENCY: "bg-red-50 text-red-600 border-red-200 animate-pulse", // Pulse effect for emergency!
}
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { Wrench, Zap, Sparkles, Wifi, Armchair, Building, AlertTriangle } from "lucide-react"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Your existing priority styles (keeping the pulse animation for EMERGENCY!)
export const priorityStyles = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-200",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  EMERGENCY: "bg-red-50 text-red-600 border-red-200 animate-pulse",
}

// NEW: Category icon mapping for visual identification
export const categoryIcons = {
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Cleanliness': Sparkles,
  'Internet': Wifi,
  'WiFi & Network': Wifi,
  'Furniture': Armchair,
  'Infrastructure': Building,
  'Other': AlertTriangle,
}
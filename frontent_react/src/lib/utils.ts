import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const houses = [
  { name: 'Aakash', color: 'bg-sky-500' },
  { name: 'Agni', color: 'bg-red-500' },
  { name: 'Vayu', color: 'bg-emerald-500' },
  { name: 'Jal', color: 'bg-purple-500' },
  { name: 'Prudhvi', color: 'bg-amber-500' },
] as const;
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// get distance in meters between two points
export function getDistanceInMeters(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) {
  const R = 6371e3; // Earth radius
  const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
  const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
  const a = Math.sin(dLat/2)**2 + Math.cos(p1.lat*(Math.PI/180)) * Math.cos(p2.lat*(Math.PI/180)) * Math.sin(dLng/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}
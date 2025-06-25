import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Obtient la zone horaire par défaut du système
 * @returns La zone horaire par défaut (ex: "Europe/Paris", "America/New_York")
 */
export function getDefaultTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convertit une date UTC en heure locale du système
 * @param date - Date UTC à convertir
 * @returns Date en heure locale
 */
export function toLocalTime(date: Date): Date {
  const timeZone = getDefaultTimeZone();
  return new Date(date.toLocaleString("en-US", { timeZone }));
}

/**
 * Formate une date en format local du système
 * @param date - Date à formater
 * @returns Date formatée en format local
 */
export function formatLocalDate(date: Date): string {
  const timeZone = getDefaultTimeZone();
  return date.toLocaleString("fr-FR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Convertit une date UTC en heure française
 * @param date - Date UTC à convertir
 * @returns Date en heure française
 */
export function toFrenchTime(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
}

/**
 * Formate une date en format français
 * @param date - Date à formater
 * @returns Date formatée en français
 */
export function formatFrenchDate(date: Date): string {
  return date.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

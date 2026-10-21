// ============================================================================
// IMPORTS
// ============================================================================

import type { UserCoordinates } from "../hooks/useLocation";
import type { Event } from "../types";
import { calculateDistanceKm } from "./distance";
import { getTodayDate, isValidEventDate } from "./validation";

// ============================================================================
// CONSTANTS
// ============================================================================

const DAY_IN_MS = 24 * 60 * 60 * 1000;

// ============================================================================
// UTILITAIRES
// ============================================================================

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// ============================================================================
// LOCALISATION
// ============================================================================

export function getEventCoordinates(event: Event) {
  if (
    event.location?.latitude === undefined ||
    event.location?.longitude === undefined
  ) {
    return null;
  }

  return {
    latitude: event.location.latitude,
    longitude: event.location.longitude,
  };
}

export function getEventDistanceKm(
  event: Event,
  userCoordinates: UserCoordinates | null,
) {
  const eventCoordinates = getEventCoordinates(event);

  if (!userCoordinates || !eventCoordinates) {
    return null;
  }

  return calculateDistanceKm(userCoordinates, eventCoordinates);
}

// Le géocodage renvoie « Ville, Région, Pays » : seule la ville est affichée en liste.
export function getShortLocationName(event: Event) {
  return event.location?.name.split(",")[0].trim() ?? "";
}

// ============================================================================
// FORMATAGE DES DATES
// ============================================================================

export function formatDayNumber(date: string) {
  if (!isValidEventDate(date)) {
    return "--";
  }

  return date.split("-")[2];
}

export function formatShortDate(date: string) {
  if (!isValidEventDate(date)) {
    return date;
  }

  const month = new Intl.DateTimeFormat("fr-FR", { month: "short" })
    .format(parseLocalDate(date))
    .replace(".", "")
    .slice(0, 4)
    .toUpperCase();

  return `${Number(date.split("-")[2])} ${month}`;
}

export function formatDayMonth(date: string) {
  if (!isValidEventDate(date)) {
    return date;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  })
    .format(parseLocalDate(date))
    .toUpperCase();
}

export function formatMonthHeader(date: string) {
  if (!isValidEventDate(date)) {
    return "DATE INCONNUE";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  })
    .format(parseLocalDate(date))
    .toUpperCase();
}

// ============================================================================
// CALCULS DE DATES
// ============================================================================

export function getDaysUntil(date: string) {
  if (!isValidEventDate(date)) {
    return null;
  }

  const today = parseLocalDate(getTodayDate());

  // L'arrondi absorbe les journées de 23 ou 25 heures lors des changements d'heure.
  return Math.round(
    (parseLocalDate(date).getTime() - today.getTime()) / DAY_IN_MS,
  );
}

export function formatCountdown(date: string) {
  const days = getDaysUntil(date);

  if (days === null || days < 0) {
    return null;
  }

  if (days === 0) {
    return "AUJOURD'HUI";
  }

  return `DANS ${days} JOUR${days > 1 ? "S" : ""}`;
}

// Numéro de semaine ISO 8601 : la semaine 1 contient le premier jeudi de l'année.
export function getIsoWeekNumber(date: string) {
  if (!isValidEventDate(date)) {
    return null;
  }

  const target = parseLocalDate(date);

  const dayOfWeek = (target.getDay() + 6) % 7;

  target.setDate(target.getDate() - dayOfWeek + 3);

  const firstThursday = new Date(target.getFullYear(), 0, 4);

  const firstDayOfWeek = (firstThursday.getDay() + 6) % 7;

  firstThursday.setDate(firstThursday.getDate() - firstDayOfWeek + 3);

  return (
    1 +
    Math.round((target.getTime() - firstThursday.getTime()) / (7 * DAY_IN_MS))
  );
}

// ============================================================================
// MÉTÉO
// ============================================================================

export function getWeatherSymbol(condition: string) {
  if (condition === "Ciel dégagé") {
    return "☀";
  }

  if (condition === "Partiellement nuageux") {
    return "⛅";
  }

  if (["Pluie", "Averses", "Bruine"].includes(condition)) {
    return "☂";
  }

  if (condition.toLowerCase().includes("neige")) {
    return "❄";
  }

  if (condition === "Orage") {
    return "⚡";
  }

  return "☁";
}

// ============================================================================
// IMPORTS
// ============================================================================

import type { Event } from "../types";

// ============================================================================
// CONSTANTES
// ============================================================================

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;

export const EMAIL_MAX_LENGTH = 254;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 64;

export const EVENT_TITLE_MIN_LENGTH = 3;
export const EVENT_TITLE_MAX_LENGTH = 80;

export const EVENT_DESCRIPTION_MIN_LENGTH = 3;
export const EVENT_DESCRIPTION_MAX_LENGTH = 500;

export const EVENT_LOCATION_MIN_LENGTH = 2;
export const EVENT_LOCATION_MAX_LENGTH = 120;

// ============================================================================
// VALIDATION DE L'AUTHENTIFICATION
// ============================================================================

// --- Nom d'utilisateur -------------------------------------------------------

export function isValidUsername(username: string) {
  const normalizedUsername = username.trim();

  if (
    normalizedUsername.length < USERNAME_MIN_LENGTH ||
    normalizedUsername.length > USERNAME_MAX_LENGTH
  ) {
    return false;
  }

  return /^[a-zA-Z0-9._-]+$/.test(normalizedUsername);
}

// --- Adresse e-mail ----------------------------------------------------------

export function isValidEmail(email: string) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || normalizedEmail.length > EMAIL_MAX_LENGTH) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

// --- Mot de passe ------------------------------------------------------------

export function isValidPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH
  );
}

// ============================================================================
// VALIDATION DES ÉVÉNEMENTS
// ============================================================================

// --- Contenu de l'événement -------------------------------------------------

export function isValidEventTitle(title: string) {
  const normalizedTitle = title.trim();

  return (
    normalizedTitle.length >= EVENT_TITLE_MIN_LENGTH &&
    normalizedTitle.length <= EVENT_TITLE_MAX_LENGTH
  );
}

export function isValidEventDescription(description: string) {
  const normalizedDescription = description.trim();

  return (
    normalizedDescription.length >= EVENT_DESCRIPTION_MIN_LENGTH &&
    normalizedDescription.length <= EVENT_DESCRIPTION_MAX_LENGTH
  );
}

export function isValidEventLocation(location: string) {
  const normalizedLocation = location.trim();

  if (!normalizedLocation) {
    return true;
  }

  return (
    normalizedLocation.length >= EVENT_LOCATION_MIN_LENGTH &&
    normalizedLocation.length <= EVENT_LOCATION_MAX_LENGTH
  );
}

// --- Date et heure -----------------------------------------------------------

export function isValidEventDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);

  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

export function isValidEventTime(time: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

// ============================================================================
// OUTILS DE DATE
// ============================================================================

// --- Construction des dates -------------------------------------------------

export function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEventDateTime(date: string, time: string) {
  if (!isValidEventDate(date) || !isValidEventTime(time)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);

  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

// --- Statut temporel ---------------------------------------------------------

export function isEventPast(date: string, time: string) {
  const eventDateTime = getEventDateTime(date, time);

  if (!eventDateTime) {
    return true;
  }

  return eventDateTime.getTime() < Date.now();
}

// --- Formatage ---------------------------------------------------------------

export function formatEventDate(date: string) {
  if (!isValidEventDate(date)) {
    return date;
  }

  const [year, month, day] = date.split("-").map(Number);

  const eventDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);
}

export function formatEventDateTime(date: string, time: string) {
  const formattedDate = formatEventDate(date);

  if (!isValidEventTime(time)) {
    return formattedDate;
  }

  return `${formattedDate} à ${time}`;
}

// ============================================================================
// TRI DES ÉVÉNEMENTS
// ============================================================================

export function sortEventsChronologically(
  firstEvent: Event,
  secondEvent: Event,
) {
  const firstDateTime = `${firstEvent.date}T${firstEvent.time}`;

  const secondDateTime = `${secondEvent.date}T${secondEvent.time}`;

  return firstDateTime.localeCompare(secondDateTime);
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EMAIL_MAX_LENGTH = 254;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 64;

export const EVENT_TITLE_MIN_LENGTH = 3;
export const EVENT_TITLE_MAX_LENGTH = 80;

export const EVENT_DESCRIPTION_MIN_LENGTH = 3;
export const EVENT_DESCRIPTION_MAX_LENGTH = 500;

// ============================================================================
// AUTHENTICATION VALIDATION
// ============================================================================

export function isValidEmail(email: string) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || normalizedEmail.length > EMAIL_MAX_LENGTH) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

export function isValidPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH
  );
}

// ============================================================================
// EVENT VALIDATION
// ============================================================================

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

export function isValidEventDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day &&
    date >= getTodayDate()
  );
}

// ============================================================================
// DATE HELPERS
// ============================================================================

export function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatEventDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const [year, month, day] = date.split("-").map(Number);

  const eventDate = new Date(year, month - 1, day);

  if (Number.isNaN(eventDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);
}

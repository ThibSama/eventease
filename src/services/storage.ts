// ============================================================================
// IMPORTS
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Event, EventOrganizer, User } from "../types";

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_VERSION_KEY = "@eventease/storage-version";
const STORAGE_VERSION = "3";

const USERS_KEY = "@eventease/v3/users";
const SESSION_KEY = "@eventease/v3/session";
const EVENTS_KEY = "@eventease/v3/events";

const EVENTEASE_ORGANIZER: EventOrganizer = {
  userId: "eventease",
  username: "EventEase",
};

// ============================================================================
// INITIALISATION DU STOCKAGE
// ============================================================================

export async function initializeStorage() {
  const currentVersion = await AsyncStorage.getItem(STORAGE_VERSION_KEY);

  if (currentVersion === STORAGE_VERSION) {
    return;
  }

  // La version 3 introduit les participants individuels et la capacité.
  // Les anciennes données de test sont volontairement supprimées.
  const storedKeys = await AsyncStorage.getAllKeys();

  const eventEaseKeys = storedKeys.filter((key) =>
    key.startsWith("@eventease/"),
  );

  if (eventEaseKeys.length > 0) {
    await AsyncStorage.multiRemove(eventEaseKeys);
  }

  await AsyncStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function getRelativeDate(dayOffset: number) {
  const date = new Date();

  // Midi évite les effets de bord liés aux changements d'heure.
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================================
// ÉVÉNEMENTS DE DÉMONSTRATION
// ============================================================================

function createDemoEvents(): Event[] {
  return [
    {
      id: "demo-react-native",
      title: "Conférence React Native",
      description:
        "Une conférence autour de React Native, Expo et du développement d'applications mobiles multiplateformes.",
      date: getRelativeDate(1),
      time: "14:30",
      participantIds: [],
      maxParticipants: 30,
      organizer: EVENTEASE_ORGANIZER,
      location: {
        name: "Cambrai, Hauts-de-France, France",
        latitude: 50.1767,
        longitude: 3.235,
      },
    },
    {
      id: "demo-docker",
      title: "Atelier Docker & API",
      description:
        "Un atelier pratique pour découvrir Docker, conteneuriser une application et manipuler une API.",
      date: getRelativeDate(3),
      time: "10:00",
      participantIds: [],
      maxParticipants: 12,
      organizer: EVENTEASE_ORGANIZER,
      location: {
        name: "Lille, Hauts-de-France, France",
        latitude: 50.6292,
        longitude: 3.0573,
      },
    },
    {
      id: "demo-gaming",
      title: "Soirée gaming de l'association",
      description:
        "Une soirée conviviale autour de jeux multijoueurs organisée par l'association.",
      date: getRelativeDate(7),
      time: "19:00",
      participantIds: [],
      organizer: EVENTEASE_ORGANIZER,
      location: {
        name: "Douai, Hauts-de-France, France",
        latitude: 50.3707,
        longitude: 3.0792,
      },
    },
    {
      id: "demo-rentree",
      title: "Rencontre de rentrée",
      description:
        "Une rencontre entre les membres de l'association pour présenter les activités et les prochains événements.",
      date: getRelativeDate(-5),
      time: "18:30",
      participantIds: [],
      maxParticipants: 50,
      organizer: EVENTEASE_ORGANIZER,
      location: {
        name: "Valenciennes, Hauts-de-France, France",
        latitude: 50.357,
        longitude: 3.5235,
      },
    },
  ];
}

// ============================================================================
// STOCKAGE DES UTILISATEURS
// ============================================================================

export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function getUsers(): Promise<User[]> {
  const value = await AsyncStorage.getItem(USERS_KEY);

  if (!value) {
    return [];
  }

  try {
    const users = JSON.parse(value) as User[];

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

// ============================================================================
// STOCKAGE DE LA SESSION
// ============================================================================

export async function saveSession(user: User) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function getSession(): Promise<User | null> {
  const value = await AsyncStorage.getItem(SESSION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ============================================================================
// STOCKAGE DES ÉVÉNEMENTS
// ============================================================================

export async function saveEvents(events: Event[]) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function getEvents(): Promise<Event[]> {
  const value = await AsyncStorage.getItem(EVENTS_KEY);

  // --- Premier lancement -----------------------------------------------------

  if (!value) {
    const demoEvents = createDemoEvents();

    await saveEvents(demoEvents);

    return demoEvents;
  }

  // --- Chargement ------------------------------------------------------------

  try {
    const events = JSON.parse(value) as Event[];

    return Array.isArray(events) ? events : [];
  } catch {
    // Un stockage illisible ne doit pas empêcher l'application de démarrer.
    return [];
  }
}

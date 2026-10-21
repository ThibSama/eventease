// ============================================================================
// IMPORTS
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Event, User } from "../types";
import { isValidEventTime } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type StoredEvent = Omit<Event, "time"> & {
  time?: string;
};

// ============================================================================
// CONSTANTES
// ============================================================================

const USER_KEY = "@eventease/user";
const SESSION_KEY = "@eventease/session";
const EVENTS_KEY = "@eventease/events";
const DEMO_SEED_KEY = "@eventease/demo-seed-v1";

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
      participated: false,
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
      participated: true,
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
      participated: false,
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
      participated: true,
      location: {
        name: "Valenciennes, Hauts-de-France, France",
        latitude: 50.357,
        longitude: 3.5235,
      },
    },
  ];
}

async function seedDemoEvents(events: Event[]) {
  const alreadySeeded = await AsyncStorage.getItem(DEMO_SEED_KEY);

  if (alreadySeeded) {
    return events;
  }

  const demoEvents = createDemoEvents();
  const existingIds = new Set(events.map((event) => event.id));

  // Les identifiants fixes évitent les doublons si l'initialisation est interrompue.
  const missingDemoEvents = demoEvents.filter(
    (event) => !existingIds.has(event.id),
  );

  const seededEvents = [...events, ...missingDemoEvents];

  await saveEvents(seededEvents);
  await AsyncStorage.setItem(DEMO_SEED_KEY, "true");

  return seededEvents;
}

// ============================================================================
// STOCKAGE UTILISATEUR
// ============================================================================

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const value = await AsyncStorage.getItem(USER_KEY);

  return value ? JSON.parse(value) : null;
}

// ============================================================================
// STOCKAGE SESSION
// ============================================================================

export async function saveSession(user: User) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function getSession(): Promise<User | null> {
  const value = await AsyncStorage.getItem(SESSION_KEY);

  return value ? JSON.parse(value) : null;
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
    return seedDemoEvents([]);
  }

  // --- Chargement et migration ----------------------------------------------

  try {
    const storedEvents = JSON.parse(value) as StoredEvent[];

    if (!Array.isArray(storedEvents)) {
      return [];
    }

    // Les anciens événements sans heure sont migrés avec une valeur par défaut.
    const migratedEvents = storedEvents.map((event) => ({
      ...event,
      time: event.time && isValidEventTime(event.time) ? event.time : "00:00",
    }));

    return seedDemoEvents(migratedEvents);
  } catch {
    // Un stockage illisible ne doit pas être remplacé automatiquement.
    return [];
  }
}

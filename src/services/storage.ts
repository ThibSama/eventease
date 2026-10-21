// ============================================================================
// IMPORTS
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Event, EventOrganizer, User } from "../types";

// ============================================================================
// CONSTANTES
// ============================================================================

const STORAGE_VERSION_KEY = "@eventease/storage-version";
const STORAGE_VERSION = "4";

const USERS_KEY = "@eventease/v4/users";
const SESSION_KEY = "@eventease/v4/session";
const EVENTS_KEY = "@eventease/v4/events";

// ============================================================================
// UTILISATEURS DE DÉMONSTRATION
// ============================================================================

const DEMO_USERS = {
  alice: {
    id: "demo-user-alice",
    username: "alice.martin",
    email: "alice@eventease.demo",
    password: "demo123",
  },
  hugo: {
    id: "demo-user-hugo",
    username: "hugo.leroy",
    email: "hugo@eventease.demo",
    password: "demo123",
  },
  sarah: {
    id: "demo-user-sarah",
    username: "sarah.dupont",
    email: "sarah@eventease.demo",
    password: "demo123",
  },
} satisfies Record<string, User>;

// ============================================================================
// INITIALISATION DU STOCKAGE
// ============================================================================

export async function initializeStorage() {
  const currentVersion = await AsyncStorage.getItem(STORAGE_VERSION_KEY);

  if (currentVersion === STORAGE_VERSION) {
    return;
  }

  // La version 4 introduit des comptes de démonstration et une activité
  // multi-utilisateurs cohérente. Les anciennes données de test sont
  // volontairement supprimées.
  const storedKeys = await AsyncStorage.getAllKeys();

  const eventEaseKeys = storedKeys.filter((key) =>
    key.startsWith("@eventease/"),
  );

  if (eventEaseKeys.length > 0) {
    await AsyncStorage.multiRemove(eventEaseKeys);
  }

  const demoUsers = createDemoUsers();
  const demoEvents = createDemoEvents();

  await Promise.all([
    AsyncStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION),
    saveUsers(demoUsers),
    saveEvents(demoEvents),
  ]);
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

function getOrganizer(user: User): EventOrganizer {
  return {
    userId: user.id,
    username: user.username,
  };
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

// --- Utilisateurs ------------------------------------------------------------

function createDemoUsers(): User[] {
  return [DEMO_USERS.alice, DEMO_USERS.hugo, DEMO_USERS.sarah];
}

// --- Événements --------------------------------------------------------------

function createDemoEvents(): Event[] {
  return [
    {
      id: "demo-react-native",
      title: "Conférence React Native",
      description:
        "Une conférence autour de React Native, Expo et du développement d'applications mobiles multiplateformes.",
      date: getRelativeDate(1),
      time: "14:30",
      participantIds: [DEMO_USERS.hugo.id, DEMO_USERS.sarah.id],
      maxParticipants: 30,
      organizer: getOrganizer(DEMO_USERS.alice),
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
      participantIds: [DEMO_USERS.alice.id, DEMO_USERS.sarah.id],
      maxParticipants: 3,
      organizer: getOrganizer(DEMO_USERS.hugo),
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
      participantIds: [DEMO_USERS.alice.id, DEMO_USERS.hugo.id],
      organizer: getOrganizer(DEMO_USERS.sarah),
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
      participantIds: [
        DEMO_USERS.alice.id,
        DEMO_USERS.hugo.id,
        DEMO_USERS.sarah.id,
      ],
      maxParticipants: 50,
      organizer: getOrganizer(DEMO_USERS.alice),
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

  // --- Premier lancement ou stockage incomplet -------------------------------

  if (!value) {
    const demoUsers = createDemoUsers();

    await saveUsers(demoUsers);

    return demoUsers;
  }

  // --- Chargement ------------------------------------------------------------

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

  // --- Premier lancement ou stockage incomplet -------------------------------

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

// ============================================================================
// IMPORTS
// ============================================================================

import { createContext, type ReactNode, useEffect, useState } from "react";

import {
  clearSession,
  getEvents,
  getSession,
  getUsers,
  initializeStorage,
  saveEvents,
  saveSession,
  saveUsers,
} from "../services/storage";
import type { Event, NewEvent, User } from "../types";
import { createUserId } from "../utils/user";
import { isEventPast, isValidEventCapacity } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type RegisterResult = "success" | "email-taken" | "username-taken";

type AppContextType = {
  user: User | null;
  events: Event[];
  loading: boolean;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<RegisterResult>;

  login: (identifier: string, password: string) => Promise<boolean>;

  logout: () => Promise<void>;

  addEvent: (event: NewEvent) => Promise<void>;

  updateEvent: (event: Event) => Promise<void>;

  deleteEvent: (id: string) => Promise<void>;

  toggleParticipated: (id: string) => Promise<void>;
};

type AppProviderProps = {
  children: ReactNode;
};

// ============================================================================
// CONTEXTE
// ============================================================================

export const AppContext = createContext<AppContextType | null>(null);

// ============================================================================
// FOURNISSEUR
// ============================================================================

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  // --- Restauration des données ---------------------------------------------

  useEffect(() => {
    async function restoreData() {
      await initializeStorage();

      const [session, savedEvents] = await Promise.all([
        getSession(),
        getEvents(),
      ]);

      setUser(session);
      setEvents(savedEvents);
      setLoading(false);
    }

    restoreData();
  }, []);

  // ==========================================================================
  // AUTHENTIFICATION
  // ==========================================================================

  // --- Inscription -----------------------------------------------------------

  async function register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResult> {
    const users = await getUsers();

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const usernameAlreadyExists = users.some(
      (existingUser) =>
        existingUser.username.toLowerCase() ===
        normalizedUsername.toLowerCase(),
    );

    if (usernameAlreadyExists) {
      return "username-taken";
    }

    const emailAlreadyExists = users.some(
      (existingUser) => existingUser.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      return "email-taken";
    }

    const newUser: User = {
      id: createUserId(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    };

    await saveUsers([...users, newUser]);
    await saveSession(newUser);

    setUser(newUser);

    return "success";
  }

  // --- Connexion -------------------------------------------------------------

  async function login(identifier: string, password: string) {
    const users = await getUsers();

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const savedUser = users.find(
      (existingUser) =>
        existingUser.email.toLowerCase() === normalizedIdentifier ||
        existingUser.username.toLowerCase() === normalizedIdentifier,
    );

    if (!savedUser || savedUser.password !== password) {
      return false;
    }

    await saveSession(savedUser);
    setUser(savedUser);

    return true;
  }

  // --- Déconnexion -----------------------------------------------------------

  async function logout() {
    await clearSession();
    setUser(null);
  }

  // ==========================================================================
  // ÉVÉNEMENTS
  // ==========================================================================

  // --- Création --------------------------------------------------------------

  async function addEvent(event: NewEvent) {
    if (!user || !isValidEventCapacity(event.maxParticipants)) {
      return;
    }

    const createdEvent: Event = {
      ...event,
      participantIds: [],
      organizer: {
        userId: user.id,
        username: user.username,
      },
    };

    const updatedEvents = [...events, createdEvent];

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Modification ----------------------------------------------------------

  async function updateEvent(event: Event) {
    if (!user || !isValidEventCapacity(event.maxParticipants)) {
      return;
    }

    const currentEvent = events.find(
      (existingEvent) => existingEvent.id === event.id,
    );

    if (!currentEvent || currentEvent.organizer.userId !== user.id) {
      return;
    }

    if (
      event.maxParticipants !== undefined &&
      event.maxParticipants < currentEvent.participantIds.length
    ) {
      return;
    }

    const updatedEvents = events.map((existingEvent) =>
      existingEvent.id === event.id
        ? {
            ...event,
            participantIds: currentEvent.participantIds,
            organizer: currentEvent.organizer,
          }
        : existingEvent,
    );

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Suppression -----------------------------------------------------------

  async function deleteEvent(id: string) {
    if (!user) {
      return;
    }

    const currentEvent = events.find((event) => event.id === id);

    if (!currentEvent || currentEvent.organizer.userId !== user.id) {
      return;
    }

    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Participation ---------------------------------------------------------

  async function toggleParticipated(id: string) {
    if (!user) {
      return;
    }

    const currentEvent = events.find((event) => event.id === id);

    if (!currentEvent) {
      return;
    }

    // L'organisateur fait déjà partie de l'événement et n'occupe aucune place.
    if (currentEvent.organizer.userId === user.id) {
      return;
    }

    // Une participation est figée dès que l'événement est passé.
    if (isEventPast(currentEvent.date, currentEvent.time)) {
      return;
    }

    const isParticipating = currentEvent.participantIds.includes(user.id);

    const eventIsFull =
      currentEvent.maxParticipants !== undefined &&
      currentEvent.participantIds.length >= currentEvent.maxParticipants;

    // Un participant déjà inscrit peut toujours libérer sa place.
    if (!isParticipating && eventIsFull) {
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id !== id) {
        return event;
      }

      return {
        ...event,
        participantIds: isParticipating
          ? event.participantIds.filter(
              (participantId) => participantId !== user.id,
            )
          : [...event.participantIds, user.id],
      };
    });

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // ==========================================================================
  // RENDU
  // ==========================================================================

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        loading,
        register,
        login,
        logout,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleParticipated,
      }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================================
// IMPORTS
// ============================================================================

import { createContext, type ReactNode, useEffect, useState } from "react";

import {
  clearSession,
  getEvents,
  getSession,
  getUser,
  saveEvents,
  saveSession,
  saveUser,
} from "../services/storage";
import type { Event, User } from "../types";
import { isEventPast } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type AppContextType = {
  user: User | null;
  events: Event[];
  loading: boolean;

  register: (email: string, password: string) => Promise<void>;

  login: (email: string, password: string) => Promise<boolean>;

  logout: () => Promise<void>;

  addEvent: (event: Event) => Promise<void>;

  updateEvent: (event: Event) => Promise<void>;

  deleteEvent: (id: string) => Promise<void>;

  toggleParticipated: (id: string) => Promise<void>;
};

type AppProviderProps = {
  children: ReactNode;
};

// ============================================================================
// CONTEXT
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

  async function register(email: string, password: string) {
    const newUser: User = {
      email,
      password,
    };

    await saveUser(newUser);
    await saveSession(newUser);

    setUser(newUser);
  }

  // --- Connexion -------------------------------------------------------------

  async function login(email: string, password: string) {
    const savedUser = await getUser();

    if (
      !savedUser ||
      savedUser.email !== email ||
      savedUser.password !== password
    ) {
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

  async function addEvent(event: Event) {
    const updatedEvents = [...events, event];

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Modification ----------------------------------------------------------

  async function updateEvent(event: Event) {
    const updatedEvents = events.map((currentEvent) =>
      currentEvent.id === event.id ? event : currentEvent,
    );

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Suppression -----------------------------------------------------------

  async function deleteEvent(id: string) {
    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  // --- Participation ---------------------------------------------------------

  async function toggleParticipated(id: string) {
    const currentEvent = events.find((event) => event.id === id);

    if (!currentEvent) {
      return;
    }

    // Une participation est figée dès que l'événement est passé.
    if (isEventPast(currentEvent.date, currentEvent.time)) {
      return;
    }

    const updatedEvents = events.map((event) =>
      event.id === id
        ? {
            ...event,
            participated: !event.participated,
          }
        : event,
    );

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

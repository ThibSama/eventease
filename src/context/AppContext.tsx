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
// PROVIDER
// ============================================================================

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
  // AUTHENTICATION
  // ==========================================================================

  async function register(email: string, password: string) {
    const newUser: User = {
      email,
      password,
    };

    await saveUser(newUser);
    await saveSession(newUser);

    setUser(newUser);
  }

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

  async function logout() {
    await clearSession();
    setUser(null);
  }

  // ==========================================================================
  // EVENTS
  // ==========================================================================

  async function addEvent(event: Event) {
    const updatedEvents = [...events, event];

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  async function updateEvent(event: Event) {
    const updatedEvents = events.map((currentEvent) =>
      currentEvent.id === event.id ? event : currentEvent,
    );

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  async function deleteEvent(id: string) {
    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  async function toggleParticipated(id: string) {
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
  // RENDER
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

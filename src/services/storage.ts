// ============================================================================
// IMPORTS
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Event, User } from "../types";

// ============================================================================
// CONSTANTS
// ============================================================================

const USER_KEY = "@eventease/user";
const SESSION_KEY = "@eventease/session";
const EVENTS_KEY = "@eventease/events";

// ============================================================================
// USER STORAGE
// ============================================================================

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const value = await AsyncStorage.getItem(USER_KEY);

  return value ? JSON.parse(value) : null;
}

// ============================================================================
// SESSION STORAGE
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
// EVENT STORAGE
// ============================================================================

export async function saveEvents(events: Event[]) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function getEvents(): Promise<Event[]> {
  const value = await AsyncStorage.getItem(EVENTS_KEY);

  return value ? JSON.parse(value) : [];
}

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "../types";

const USER_KEY = "@eventease/user";
const SESSION_KEY = "@eventease/session";

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const value = await AsyncStorage.getItem(USER_KEY);

  return value ? JSON.parse(value) : null;
}

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

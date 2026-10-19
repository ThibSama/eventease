import { createContext, type ReactNode, useEffect, useState } from "react";

import {
  clearSession,
  getSession,
  getUser,
  saveSession,
  saveUser,
} from "../services/storage";
import type { User } from "../types";

type AppContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const session = await getSession();

      setUser(session);
      setLoading(false);
    }

    restoreSession();
  }, []);

  async function register(email: string, password: string) {
    const newUser = { email, password };

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

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}>
      {children}
    </AppContext.Provider>
  );
}

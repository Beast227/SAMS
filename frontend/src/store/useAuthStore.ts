import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  _hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      _hasHydrated: false, // flag
    }),
    {
      name: "blera-auth",
      onRehydrateStorage: () => (state) => {
        state!._hasHydrated = true;
      },
    },
  ),
);

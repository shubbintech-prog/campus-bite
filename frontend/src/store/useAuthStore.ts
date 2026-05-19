import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  image_url?: string;
  role: "student" | "vendor" | "super_admin" | "auditor" | "support" | "admin";
  roles: string[];
  active_role: string;
  onboarding_completed: boolean;
  seller_onboarding_status: "none" | "pending" | "approved";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (fields: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (fields) => set((state) => ({
        user: state.user ? { ...state.user, ...fields } : null
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);

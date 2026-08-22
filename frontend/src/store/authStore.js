import { create } from "zustand";
import api from "../lib/api";
import useLanguageStore from "./languageStore";

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
};

const initialToken = getInitialToken();

const useAuthStore = create((set) => ({
  token: initialToken,
  user: null,
  isHydrating: !!initialToken,
  isHydrated: !initialToken,

  login: (token, user) => {
    localStorage.setItem("token", token);
    if (user?.language) {
      useLanguageStore.getState().setLanguage(user.language);
    }
    set({ token, user, isHydrating: false, isHydrated: true });
  },

  updateUser: (user) => {
    if (user?.language) {
      useLanguageStore.getState().setLanguage(user.language);
    }
    set((state) => ({ user: { ...state.user, ...user } }));
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isHydrating: false, isHydrated: true });
  },

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ token: null, user: null, isHydrating: false, isHydrated: true });
      return;
    }

    set({ token, isHydrating: true });
    try {
      const data = await api.get("/auth/me");
      if (data?.language) {
        useLanguageStore.getState().setLanguage(data.language);
      }
      set({ token, user: data, isHydrating: false, isHydrated: true });
    } catch (error) {
      console.error("Hydration failed:", error);
      localStorage.removeItem("token");
      set({ token: null, user: null, isHydrating: false, isHydrated: true });
    }
  },
}));

export default useAuthStore;

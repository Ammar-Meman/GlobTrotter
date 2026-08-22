import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
  token: null,
  user: null,

  login: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ token: null, user: null });
      return;
    }

    try {
      // Temporarily set token so the api call has it (handled in api.js by reading localStorage)
      const data = await api.get("/auth/me");
      set({ token, user: data });
    } catch (error) {
      console.error("Hydration failed:", error);
      localStorage.removeItem("token");
      set({ token: null, user: null });
    }
  },
}));

export default useAuthStore;

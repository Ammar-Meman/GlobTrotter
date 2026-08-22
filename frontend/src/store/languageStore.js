import { create } from "zustand";
import { getTranslation } from "../lib/i18n";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved) return saved;
  }
  return "en";
};

const useLanguageStore = create((set, get) => ({
  language: getInitialLanguage(),

  setLanguage: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", lang);
    }
    set({ language: lang });
  },

  t: (key) => {
    const currentLang = get().language || "en";
    return getTranslation(currentLang, key);
  },
}));

export default useLanguageStore;

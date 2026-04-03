
import { createContext, useContext, useState, useCallback } from "react";

import en from "@/locales/en.json";
import am from "@/locales/am.json";




const translations = { en, am };







const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = useCallback((key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>);

}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
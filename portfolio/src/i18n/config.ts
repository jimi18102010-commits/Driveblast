import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/translation.json";
import ru from "../locales/ru/translation.json";
import uz from "../locales/uz/translation.json";
import de from "../locales/de/translation.json";
import zh from "../locales/zh/translation.json";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
  de: { translation: de },
  zh: { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;

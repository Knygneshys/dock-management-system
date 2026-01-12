import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).use(I18nextBrowserLanguageDetector).use(Backend).init({
  debug: false,
  fallback: "en"
});

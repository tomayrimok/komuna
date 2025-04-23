import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import he from './locales/he.json';

i18n
  .use(LanguageDetector) // detect browser language
  .use(initReactI18next) // pass to react-i18next
  .init({
    lng: 'he',
    fallbackLng: 'he',
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof he;
    };
  }
}

export default i18n;

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

type Language = 'en' | 'es';

type Translations = typeof enTranslations;

const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first, then browser language
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language;
      if (stored && (stored === 'en' || stored === 'es')) {
        return stored;
      }
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'es' ? 'es' : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(translations[language], key);
    if (!translation || translation === key) {
      return key;
    }
    // Replace placeholders like {field}, {min}, {max}, etc.
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        translation = translation.replace(
          new RegExp(`\\{${paramKey}\\}`, 'g'),
          String(params[paramKey])
        );
      });
    }
    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}


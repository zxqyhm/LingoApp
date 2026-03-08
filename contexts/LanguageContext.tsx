/**
 * Language Context for Global Language Switching
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSavedLanguage, saveLanguage, translations, TranslationLanguage } from '@/i18n';

interface LanguageContextType {
  language: TranslationLanguage;
  setLanguage: (lang: TranslationLanguage) => Promise<void>;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<TranslationLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await getSavedLanguage();
      setLanguageState(savedLang);
      setIsLoading(false);
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: TranslationLanguage) => {
    await saveLanguage(lang);
    setLanguageState(lang);
  };

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};

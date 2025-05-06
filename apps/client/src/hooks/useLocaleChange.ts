import { useState, useEffect } from 'react';
import i18n from 'i18next';

export const useLocaleChange = () => {
  const [locale, setLocale] = useState(i18n.language);
  const [dir, setDir] = useState('rtl');

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (lng === 'he') {
        setLocale('he-IL');
        document.documentElement.setAttribute('dir', 'rtl');
        setDir('rtl');
      }
      if (lng === 'en') {
        setLocale('en-US');
        document.documentElement.setAttribute('dir', 'ltr');
        setDir('ltr');
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return { locale, isRTL: dir === 'rtl' };
};

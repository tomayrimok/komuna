import { useTranslation } from 'react-i18next';

export const useIsRTL = () => {
  const { i18n } = useTranslation();
  return { isRTL: i18n.dir() === 'rtl', dir: i18n.dir() };
};

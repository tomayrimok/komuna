import React from 'react';
import { SegmentGroup } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LANGUEGES = ['he', 'en'] as const;

export const LanguegeSelector = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <SegmentGroup.Root
      value={currentLang.toUpperCase()}
      onValueChange={(e) => i18n.changeLanguage(e.value?.toLowerCase() as (typeof LANGUEGES)[number])}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={LANGUEGES.map((lang) => lang.toUpperCase())} />
    </SegmentGroup.Root>
  );
};

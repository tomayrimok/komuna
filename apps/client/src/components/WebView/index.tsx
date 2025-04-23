import React from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const WebView = () => {
  const { t } = useTranslation();

  return (
    <VStack padding="4" gap="4" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold">
        {t('web.title')} 😔
      </Text>
      <Text fontSize="md" maxW="sm">
        {t('web.description')}
      </Text>
    </VStack>
  );
};

import React from 'react';
import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { t } = useTranslation();

  console.log('Test');

  return (
    <VStack padding="4" gap="4">
      <Image src="meerkats/swiping.svg" />
      <Text fontSize="xl" fontWeight="bold">
        {t('title')} 🎉
      </Text>
      <Button colorScheme="yellow" size="lg">
        {t('button')}
      </Button>
    </VStack>
  );
};

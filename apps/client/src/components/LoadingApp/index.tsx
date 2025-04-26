import { Box, Center, Heading, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const LoadingApp = () => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column" flex="1" justifyContent="space-between">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="273"
        height="180"
        viewBox="0 0 273 180"
        fill="none"
        style={{ top: 0, right: 0, position: 'relative' }}
      >
        <circle cx="180" r="180" fill="#F9C154" />
      </svg>
      <Center flexDirection="column">
        <Image src="/meerkats/campfire.png" alt="campfire" maxWidth="303px" />
        <VStack gap="1">
          <Heading fontFamily="logo" size="6xl" height="12">
            {t('komuna')}
          </Heading>
          <Text fontWeight="bold" fontSize="lg">
            {t('catchphrase')}
          </Text>
          <Spinner />
        </VStack>
      </Center>
      <Box display="flex" justifyContent="end">
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180" fill="none">
          <circle cx="120" cy="180" r="180" fill="#F9C154" />
        </svg>
      </Box>
    </Box>
  );
};

import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ApartmentSettings = () => {
  const { t } = useTranslation();

  return (
    <Box padding="4" backgroundColor="brand.10" minH="100vh">
      <VStack borderSpacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          {t('create_apartment.apartment_settings.title')}
        </Text>

        {/* Contract End Date */}
        <VStack align="stretch">
          <Text>{t('create_apartment.apartment_settings.contract_end_date')}</Text>
          <Input type="date" backgroundColor="white" />
        </VStack>

        {/* Upload Contract */}
        <VStack align="stretch">
          <Text>{t('create_apartment.apartment_settings.file_upload')}</Text>
          <Button /* TODOleftIcon={<UploadIcon />} */ variant="outline">
            {t('create_apartment.apartment_settings.contract_document_upload')}
          </Button>
        </VStack>

        {/* Rent Price */}
        <VStack align="stretch">
          <Text>{t('create_apartment.apartment_settings.rent_price')}</Text>
          <Input type="number" placeholder="₪" backgroundColor="white" />
        </VStack>

        {/* Bill Providers */}
        <VStack align="stretch">
          <Text>{t('create_apartment.apartment_settings.accounts_location.title')}</Text>
          <HStack>
            {/* TODO <Select
              placeholder={t('create_apartment.apartment_settings.accounts_location.electricity')}
              backgroundColor="white"
            />
            <Select
              placeholder={t('create_apartment.apartment_settings.accounts_location.water')}
              backgroundColor="white"
            />
            <Select
              placeholder={t('create_apartment.apartment_settings.accounts_location.gas')}
              backgroundColor="white"
            />
            <Select.Root>
              <Select.HiddenSelect />
              <Select.Label />

              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>

              <Select.Positioner>
                <Select.Content>
                  <Select.Item />

                  <Select.ItemGroup>
                    <Select.ItemGroupLabel />
                    <Select.Item />
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root> */}
          </HStack>
        </VStack>

        {/* Submit Button */}
        <Button colorScheme="yellow" size="lg">
          {t('create_apartment.continue_btn')}
        </Button>
      </VStack>
    </Box>
  );
};

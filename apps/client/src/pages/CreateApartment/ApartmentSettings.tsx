import { useMemo } from "react";
import { Field, HStack, Input, Stack, VStack, Text, InputGroup, Button, useFileUpload, FileUpload } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ApartmentTitle from "./ApartmentTitle";
import { IconCurrencyShekel, IconBulb, IconDroplet, IconFlame, IconFile } from "@tabler/icons-react";

interface ApartmentSettingsProps {

}

export const ApartmentSettings = ({ }: ApartmentSettingsProps) => {
  const { t } = useTranslation();

  const billFields = useMemo(() => [
    { title: t("create_apartment.apartment_settings.accounts_location.electricity"), onChange: (value: string) => { }, Icon: IconBulb, },
    { title: t("create_apartment.apartment_settings.accounts_location.water"), onChange: (value: string) => { }, Icon: IconDroplet, },
    { title: t("create_apartment.apartment_settings.accounts_location.gas"), onChange: (value: string) => { }, Icon: IconFlame, },
  ], [t]);


  const fileUpload = useFileUpload({
    maxFiles: 1,
    onFileAccept: (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // onSetProfileKey('image', reader.result as string);
        };
        reader.readAsDataURL(file.files[0]);
      }
    },
  });

  return (
    <>
      <ApartmentTitle
        title={t('create_apartment.apartment_settings.title')}
      />
      <Stack width="100%" gap="6">
        <Field.Root>
          <Field.Label fontWeight="bold" fontSize="md">
            {t('create_apartment.apartment_settings.contract_end_date')}
          </Field.Label>
          <Input
            // w="80%"
            // onChange={(e) => field.onChange(e.target.value)}
            // name="firstName"
            backgroundColor="white"
            size="xl"
            fontSize="xl"
          />
        </Field.Root>

        <HStack w="100%" justify="center">
          <Text fontWeight="bold" fontSize="md" w="70%">
            {t('create_apartment.apartment_settings.file_upload')}
          </Text>
          <FileUpload.RootProvider value={fileUpload} >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Stack w="100%">
                <Button
                  backgroundColor="white"
                  size="xl"
                  fontSize="xl"
                  colorPalette="gray"
                  variant="outline"
                >
                  {t('create_apartment.apartment_settings.contract_document_upload')}
                  <IconFile />
                </Button>
              </Stack>
            </FileUpload.Trigger>
          </FileUpload.RootProvider>
        </HStack>

        <Field.Root>
          <HStack justify="space-between">
            <Field.Label fontWeight="bold" fontSize="md">
              {t('create_apartment.apartment_settings.rent_price')}
            </Field.Label>
            <InputGroup endElement={<IconCurrencyShekel />}>
              <Input
                // onChange={(e) => field.onChange(e.target.value)}
                // name="firstName"
                backgroundColor="white"
                size="xl"
                fontSize="xl"
              />
            </InputGroup>
          </HStack>
        </Field.Root>

        <Text fontWeight="bold" fontSize="large">
          {t('create_apartment.apartment_settings.accounts_location.title')}
        </Text>
        {billFields.map((field) => (
          <Field.Root>
            <VStack align="stretch">
              <HStack justify="space-between">
                <Field.Label w="90px" fontWeight="bold" fontSize="md">
                  <field.Icon />
                  {field.title}
                </Field.Label>
                <Input
                  w="90%"
                  onChange={(e) => field.onChange(e.target.value)}
                  // name="firstName"
                  backgroundColor="white"
                  size="xl"
                  fontSize="xl"
                  placeholder={t('create_apartment.apartment_settings.accounts_location.supplier_name')}
                />
              </HStack>
            </VStack>
          </Field.Root>
        ))}
      </Stack>
    </>
  );
}

export default ApartmentSettings;
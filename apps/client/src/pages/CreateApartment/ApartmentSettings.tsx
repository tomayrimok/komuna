import { useMemo, useState } from 'react';
import {
  Field,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  InputGroup,
  Button,
  useFileUpload,
  FileUpload,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { IconCurrencyShekel, IconBulb, IconDroplet, IconFlame, IconFile } from '@tabler/icons-react';
import { BillsDetails } from '@komuna/types';
import { withMask } from 'use-mask-input';
import type { CommonApartmentProps } from './create-apartment.types';

export const ApartmentSettings = ({ aptDetails, updateField }: CommonApartmentProps<'apartmentSettings'>) => {
  const { t } = useTranslation();
  const [contractFileName, setContractFileName] = useState<string>('');

  const billFields = useMemo(
    () => [
      {
        key: 'electricity',
        title: t('create_apartment.apartment_settings.accounts_location.electricity'),
        Icon: IconBulb,
      },
      { key: 'water', title: t('create_apartment.apartment_settings.accounts_location.water'), Icon: IconDroplet },
      { key: 'gas', title: t('create_apartment.apartment_settings.accounts_location.gas'), Icon: IconFlame },
    ],
    [t]
  );

  const fileUpload = useFileUpload({
    maxFiles: 1,
    onFileAccept: (file) => {
      if (file) {
        const uploadedFile = file.files[0];
        setContractFileName(uploadedFile.name);
        const reader = new FileReader();
        reader.onload = () => {
          updateField('contractUrl', reader.result as string);
        };
        reader.readAsDataURL(uploadedFile);
      }
    },
  });

  return (
    <>
      <ApartmentTitle title={t('create_apartment.apartment_settings.title')} />
      <Stack width="100%" gap="6" mt={4}>
        <Field.Root>
          <HStack w="100%" justifyContent={"space-between"}>
            <Field.Label fontSize="md" whiteSpace={"nowrap"}>
              {t('create_apartment.apartment_settings.contract_end_date')}
            </Field.Label>
            <Input
              value={
                aptDetails.apartmentSettings.contractEndDate
                  ? typeof aptDetails.apartmentSettings.contractEndDate === 'string'
                    ? aptDetails.apartmentSettings.contractEndDate
                    : `${aptDetails.apartmentSettings.contractEndDate.getDate()}/${aptDetails.apartmentSettings.contractEndDate.getMonth() + 1
                    }/${aptDetails.apartmentSettings.contractEndDate.getFullYear()}`
                  : ''
              }
              placeholder="dd/mm/yyyy"
              ref={withMask('99/99/9999')}
              direction="ltr"
              onChange={(e) => updateField('contractEndDate', e.target.value)}
              backgroundColor="white"
              size="xl"
              fontSize="xl"
              w={"50vw"}
            />
          </HStack>
        </Field.Root>

        <Field.Root>
          <HStack w="100%" justifyContent={"space-between"}>
            <Field.Label fontSize="md" whiteSpace={"nowrap"}>
              {t('create_apartment.apartment_settings.file_upload')}
            </Field.Label>

            <FileUpload.RootProvider value={fileUpload}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Stack w="100%">
                  <Button
                    width={"50vw"}
                    backgroundColor="white"
                    size="xl"
                    fontSize="xl"
                    colorPalette="gray"
                    variant="outline"
                    _hover={{}}
                    _active={{}}
                    overflow={"hidden"}
                    ms={"auto"}
                  >
                    {aptDetails.apartmentSettings.contractUrl ?
                      <Text
                        textOverflow={"ellipsis"}
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        w={"100%"}
                      >
                        {contractFileName || 'File uploaded'}
                      </Text>
                      : t('create_apartment.apartment_settings.contract_document_upload')
                    }
                    <IconFile />
                  </Button>
                </Stack>
              </FileUpload.Trigger>
            </FileUpload.RootProvider>
          </HStack>
        </Field.Root>

        <Field.Root>
          <HStack justify="space-between" w={"100%"}>
            <Field.Label fontSize="md" whiteSpace={"nowrap"}>
              {t('create_apartment.apartment_settings.rent_price')}
            </Field.Label>
            <InputGroup endElement={<IconCurrencyShekel />}>
              <Input
                width={"50vw"}
                value={aptDetails.apartmentSettings.rent}
                onChange={(e) => updateField('rent', e.target.value)}
                backgroundColor="white"
                size="xl"
                fontSize="xl"
                ms={"auto"}
              />
            </InputGroup>
          </HStack>
        </Field.Root>

        <Text fontSize="large" fontWeight={"bold"}>
          {t('create_apartment.apartment_settings.accounts_location.title')}
        </Text>
        {billFields.map((field) => (
          <Field.Root key={field.key} >
            <VStack align="stretch" w={"100%"}>
              <HStack justify="space-between" w={"100%"}>
                <Field.Label w="90px" fontSize="md" whiteSpace={"nowrap"}>
                  <field.Icon />
                  {field.title}
                </Field.Label>
                <Input
                  value={aptDetails.apartmentSettings.billsDetails?.[field.key as keyof BillsDetails] || ''}
                  onChange={(e) =>
                    updateField('billsDetails', {
                      ...aptDetails.apartmentSettings.billsDetails,
                      [field.key]: e.target.value,
                    })
                  }
                  placeholder={t('create_apartment.apartment_settings.accounts_location.supplier_name')}
                  w="50vw"
                  backgroundColor="white"
                  size="xl"
                  fontSize="xl"
                />
              </HStack>
            </VStack>
          </Field.Root>
        ))}
      </Stack>
    </>
  );
};

export default ApartmentSettings;

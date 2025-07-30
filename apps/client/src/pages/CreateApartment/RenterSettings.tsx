import { Fragment, useMemo } from 'react';
import { Field, HStack, Input, Stack, RadioCard, InputGroup, VStack, Alert, Portal, Select, createListCollection } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RenterSettingsDto, RENTER_PAYMENT_WAYS } from '@komuna/types';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { IconCurrencyShekel } from '@tabler/icons-react';
import type { CommonApartmentProps } from './create-apartment.types';
import { useApartment } from '../../hooks/useApartment';
import { useAuth } from '../../context/auth/AuthProvider';

export const RenterSettings = ({
  aptDetails,
  updateField,
  isEdit,
}: CommonApartmentProps<'renterSettings'> & { isEdit: boolean }) => {
  const { t } = useTranslation();
  const { data } = useApartment();
  const { currentUserDetails } = useAuth();

  const fields = useMemo(() => {
    const fields = [
      {
        key: 'rent' as const,
        title: t('create_apartment.renter_settings.renter_rent_price'),
        optionTitle: t('create_apartment.renter_settings.renter_payment_ways.title'),
        optionsKey: 'payableByUserId' as const,
        options: [
          {
            value: RENTER_PAYMENT_WAYS.RENTER,
            title: t('create_apartment.renter_settings.renter_payment_ways.renter_pays'),
          },
          {
            value: RENTER_PAYMENT_WAYS.ELSE,
            title: t('create_apartment.renter_settings.renter_payment_ways.paying_for_renter'),
            select: true,
          },
        ],
      },
      {
        key: 'houseCommitteeRent' as const,
        title: t('create_apartment.renter_settings.house_maintenance_fee'),
        optionTitle: t('create_apartment.renter_settings.renter_house_maintenance_payment_ways.title'),
        optionsKey: 'houseCommitteePayerUserId' as const,
        options: [
          {
            value: RENTER_PAYMENT_WAYS.RENTER,
            title: t('create_apartment.renter_settings.renter_house_maintenance_payment_ways.renter_pays'),
          },
          {
            value: RENTER_PAYMENT_WAYS.ELSE,
            title: t('create_apartment.renter_settings.renter_house_maintenance_payment_ways.paying_for_renter'),
            select: true,
          },
        ],
      },
    ];
    if (!isEdit) {
      fields[0].options = [];
      fields[1].options.pop();
    }
    return fields;
  }, [t, isEdit]);

  const residents = useMemo(() => {
    const items = data?.residents?.filter(({ user: { userId } }) => currentUserDetails?.userId !== userId)
      .map(({ user: { userId, firstName, lastName } }: { user: { userId: string, firstName: string, lastName: string } }) => {
        return {
          label: `${firstName} ${lastName}`,
          value: userId,
        }
      }) || [];
    return createListCollection({ items });
  }, [data, currentUserDetails]);

  return (
    <>
      <Stack width="100%" gap="5" flexGrow={1}>
        <ApartmentTitle title={t('create_apartment.renter_settings.title')} />
        {fields.map((field) => (
          <Fragment key={field.key}>
            <Field.Root>
              <HStack justify="space-between">
                <Field.Label fontWeight="bold" fontSize="md" w="70%">
                  {field.title}
                </Field.Label>
                <InputGroup endElement={<IconCurrencyShekel />}>
                  <Input
                    value={aptDetails.renterSettings[field.key as keyof RenterSettingsDto]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    backgroundColor="white"
                    size="xl"
                    fontSize="xl"
                  />
                </InputGroup>
              </HStack>
            </Field.Root>

            {field.options.length === 0 ? null : (
              <RadioCard.Root
                orientation="horizontal"
                variant="subtle"
                defaultValue={
                  aptDetails.renterSettings[field.optionsKey as keyof RenterSettingsDto] === RENTER_PAYMENT_WAYS.RENTER
                    || (field.optionsKey === "houseCommitteePayerUserId" && aptDetails.renterSettings.houseCommitteePayerUserId === currentUserDetails?.userId)
                    || (field.optionsKey === "payableByUserId" && aptDetails.renterSettings.payableByUserId === currentUserDetails?.userId)
                    ? RENTER_PAYMENT_WAYS.RENTER
                    : RENTER_PAYMENT_WAYS.ELSE
                }
                onValueChange={({ value }) => updateField(field.optionsKey, value)}

              >
                <RadioCard.Label fontWeight="bold" fontSize="md">
                  {field.optionTitle}
                </RadioCard.Label>
                {field.options.map((option) => (
                  <RadioCard.Item key={option.value} value={option.value} backgroundColor="transparent">
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl backgroundColor="transparent">
                      <RadioCard.ItemIndicator />
                      <VStack align="left">
                        <RadioCard.ItemText>{option.title}</RadioCard.ItemText>
                        {'select' in option && option.select && data?.residents ? (
                          <Select.Root
                            backgroundColor='white'
                            collection={residents}
                            value={
                              aptDetails.renterSettings[field.optionsKey as keyof RenterSettingsDto]
                                ? [aptDetails.renterSettings[field.optionsKey as keyof RenterSettingsDto] as string]
                                : undefined
                            }
                            onValueChange={(e) => updateField(field.optionsKey, e.value[0])}
                            disabled={
                              aptDetails.renterSettings[field.optionsKey as keyof RenterSettingsDto] === RENTER_PAYMENT_WAYS.RENTER
                              || (field.optionsKey === "houseCommitteePayerUserId" && aptDetails.renterSettings.houseCommitteePayerUserId === currentUserDetails?.userId)
                              || (field.optionsKey === "payableByUserId" && aptDetails.renterSettings.payableByUserId === currentUserDetails?.userId)
                              || residents.items.length === 0
                            }
                          >
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder={t('create_apartment.renter_settings.select_roomate')} />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {residents.items.map((resident) => (
                                    <Select.Item item={resident} key={resident.value}>
                                      {resident.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        ) : null}
                      </VStack>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </RadioCard.Root>
            )}
          </Fragment>
        ))}
      </Stack>

      {
        isEdit ? null : (
          <Alert.Root status="info">
            <Alert.Indicator />
            <Alert.Title>{t('create_apartment.renter_settings.on_create_notice')}</Alert.Title>
          </Alert.Root>
        )
      }
    </>
  );
};

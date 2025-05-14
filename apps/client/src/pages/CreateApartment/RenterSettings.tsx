import { useMemo } from "react";
import { Field, HStack, Input, Stack, RadioCard, InputGroup, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CreateApartmentDto, RenterSettingsDto, UserRole } from "@komuna/types";
import ApartmentTitle from "./ApartmentTitle";
import { IconCurrencyShekel } from "@tabler/icons-react";

enum RenterPaymentWays {
  Renter = "renter",
  Equally = "equally",
  Else = "else",
}
interface RenterSettingsProps {
  aptDetails: CreateApartmentDto;
  updateField: (
    field: string,
    value: unknown
  ) => void;
}

export const RenterSettings = ({ aptDetails, updateField }: RenterSettingsProps) => {
  const { t } = useTranslation();

  const fields = useMemo(() => [
    {
      key: "rent",
      title: t("create_apartment.renter_settings.renter_rent_price"),
      optionTitle: t("create_apartment.renter_settings.renter_payment_ways.title"),
      optionsKey: "payableByUserId",
      options: [
        { value: RenterPaymentWays.Renter, title: t("create_apartment.renter_settings.renter_payment_ways.renter_pays"), },
        { value: RenterPaymentWays.Else, title: t("create_apartment.renter_settings.renter_payment_ways.paying_for_renter"), input: true, },
      ],
    },
    {
      key: "houseCommitteeRent",
      title: t("create_apartment.renter_settings.house_maintenance_fee"),
      optionTitle: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.title"),
      optionsKey: "houseCommitteePayerUserId",
      options: [
        { value: RenterPaymentWays.Renter, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.renter_pays"), },
        { value: RenterPaymentWays.Equally, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.renters_paying_equally"), },
        { value: RenterPaymentWays.Else, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.paying_for_renter"), input: true, },
      ],
    },
  ], [t]);


  return (
    <Stack width="100%" gap="5">
        <ApartmentTitle
          title={t('create_apartment.renter_settings.title')}
        />
        {fields.map((field) => (
          <>
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

            <RadioCard.Root
              orientation="horizontal"
              variant="subtle"
              defaultValue={field.options[0].value}
              onValueChange={({ value }) => updateField(field.optionsKey, value)}
            >
              <RadioCard.Label fontWeight="bold" fontSize="md">
                {field.optionTitle}
              </RadioCard.Label>
              {field.options.map((option) => (
                <RadioCard.Item
                  key={option.value}
                  value={option.value}
                  backgroundColor="transparent"
                >
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl backgroundColor="transparent">
                    <RadioCard.ItemIndicator />
                    <VStack align="left">
                      <RadioCard.ItemText>
                        {option.title}
                      </RadioCard.ItemText>
                      {option.input ?
                        <Input
                          // onChange={(e) => option.onChange(e.target.value)}
                          backgroundColor="white"
                          w="150%"
                        /> : null}
                    </VStack>
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </RadioCard.Root >
          </>
        ))}
      </Stack >
  );
}

export default RenterSettings;

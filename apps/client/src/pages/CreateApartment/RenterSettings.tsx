import { useMemo } from "react";
import { Field, HStack, Input, Stack, RadioCard, InputGroup, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { UserRoleName } from "@komuna/types";
import ApartmentTitle from "./ApartmentTitle";
import { IconCurrencyShekel } from "@tabler/icons-react";

enum RenterPaymentWays {
  Renter = "renter",
  Equally = "equally",
  Else = "else",
}
interface RenterSettingsProps {

}

export const RenterSettings = ({ }: RenterSettingsProps) => {
  const { t } = useTranslation();

  const fields = useMemo(() => [
    {
      title: t("create_apartment.renter_settings.renter_rent_price"),
      onChange: (value: string) => { },
      optionTitle: t("create_apartment.renter_settings.renter_payment_ways.title"),
      options: [
        { value: RenterPaymentWays.Renter, title: t("create_apartment.renter_settings.renter_payment_ways.renter_pays"), },
        { value: RenterPaymentWays.Else, title: t("create_apartment.renter_settings.renter_payment_ways.paying_for_renter"), input: true, onChange: (value: string) => { }, },
      ],
    },
    {
      title: t("create_apartment.renter_settings.house_maintenance_fee"),
      onChange: (value: string) => { },
      optionTitle: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.title"),
      options: [
        { value: RenterPaymentWays.Renter, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.renter_pays"), },
        { value: RenterPaymentWays.Equally, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.renters_paying_equally"), },
        { value: RenterPaymentWays.Else, title: t("create_apartment.renter_settings.renter_house_maintenance_payment_ways.paying_for_renter"), input: true, onChange: (value: string) => { }, },
      ],
    },
  ], [t]);


  return (
    <>
      <Stack width="100%" gap="6">
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
                    onChange={(e) => field.onChange(e.target.value)}
                    // name="firstName"
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
              defaultValue={UserRoleName.Renter}
            >
              <RadioCard.Label fontWeight="bold" fontSize="md" marginBottom="10px">
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
                      <RadioCard.ItemText>{option.title}</RadioCard.ItemText>
                      {option.input ?
                        <Input
                          onChange={(e) => option.onChange(e.target.value)}
                          name="firstName"
                          backgroundColor="white"
                          w="150%"
                        /> : null}
                    </VStack>
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </RadioCard.Root>
          </>
        ))}
      </Stack>
    </>
  );
}

export default RenterSettings;
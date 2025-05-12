import { Button, Field, HStack, Image, Input, Stack, Text, VStack, RadioCard } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { UserRoleName } from "@komuna/types";
import { useMemo } from "react";

interface ApartmentInfoProps {

}

export const ApartmentInfo = ({ }: ApartmentInfoProps) => {
  const { t } = useTranslation();

  const fields = useMemo(() => [
    { title: t("create_apartment.apartment_info.apartment_name"), onChange: (value: string) => { }, required: true, },
    { title: t("create_apartment.apartment_info.apartment_address"), onChange: (value: string) => { }, required: false, },
    { title: t("create_apartment.apartment_info.city"), onChange: (value: string) => { }, required: false, },
  ], [t]);

  const items = useMemo(() => [
    { value: UserRoleName.Renter, title: t("create_apartment.apartment_info.who_am_i.renter"), image: "/detailed_icons/renter.png" },
    { value: UserRoleName.Leaser, title: t("create_apartment.apartment_info.who_am_i.leaser"), image: "/detailed_icons/leaser.png" },
  ], [t]);

  return (
    <>
      <VStack width="100%" paddingX="3" gap="10">
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            {t('create_apartment.apartment_info.title')}
          </Text>
          <Text>{t('create_apartment.apartment_info.description')}</Text>
        </VStack>

        <Stack width="100%" gap="6">
          {fields.map((field) => (
            <Field.Root required={field.required}>
              <Field.Label fontWeight="bold" fontSize="md">
                {field.title}
              </Field.Label>
              <Input
                onChange={(e) => field.onChange(e.target.value)}
                name="firstName"
                backgroundColor="white"
                size="xl"
                fontSize="xl"
              />
            </Field.Root>
          ))}

          <RadioCard.Root
            orientation="vertical"
            align="center"
            maxW="400px"
            defaultValue={UserRoleName.Renter}
          >
            <RadioCard.Label fontWeight="bold" fontSize="md">
              {t("create_apartment.apartment_info.who_am_i.title")}
            </RadioCard.Label>
            <HStack>
              {items.map((item) => (
                <RadioCard.Item key={item.value} value={item.value}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <Image height="130px" src={item.image} />
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </HStack>
          </RadioCard.Root>
        </Stack>
      </VStack>
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold"
      // marginBottom="12"
      // loading={isPending}
      // disabled={!profileDetatils.firstName || !profileDetatils.lastName}
      // onClick={() => triggerCreateProfile(profileDetatils)}
      >
        {t('create_profile.create_profile')}
      </Button>
    </>
  );
}

export default ApartmentInfo;
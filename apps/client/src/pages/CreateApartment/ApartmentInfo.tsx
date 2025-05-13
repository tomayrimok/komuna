import { useMemo } from "react";
import { Field, HStack, Image, Input, Stack, RadioCard } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { UserRole } from "@komuna/types";
import ApartmentTitle from "./ApartmentTitle";

interface ApartmentInfoProps {
  goBack: () => void;
}

export const ApartmentInfo = ({ goBack }: ApartmentInfoProps) => {
  const { t } = useTranslation();

  const fields = useMemo(() => [
    { title: t("create_apartment.apartment_info.apartment_name"), onChange: (value: string) => { }, required: true, },
    { title: t("create_apartment.apartment_info.apartment_address"), onChange: (value: string) => { }, required: false, },
    { title: t("create_apartment.apartment_info.city"), onChange: (value: string) => { }, required: false, },
  ], [t]);

  const roles = useMemo(() => [
    { value: UserRole.ROOMMATE, title: t("create_apartment.apartment_info.who_am_i.renter"), image: "/detailed_icons/renter.png" },
    { value: UserRole.LANDLORD, title: t("create_apartment.apartment_info.who_am_i.leaser"), image: "/detailed_icons/leaser.png" },
  ], [t]);

  return (
    <>
      <Stack width="100%" gap="6">
        <ApartmentTitle
          title={t('create_apartment.apartment_info.title')}
          description={t('create_apartment.apartment_info.description')}
        />
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
          defaultValue={UserRole.ROOMMATE}
        >
          <RadioCard.Label fontWeight="bold" fontSize="md">
            {t("create_apartment.apartment_info.who_am_i.title")}
          </RadioCard.Label>
          <HStack>
            {roles.map((role) => (
              <RadioCard.Item key={role.value} value={role.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <Image height="130px" src={role.image} />
                  <RadioCard.ItemText>{role.title}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
      </Stack>
    </>
  );
}

export default ApartmentInfo;
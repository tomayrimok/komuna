import { useMemo } from "react";
import { Field, HStack, Image, Input, Stack, RadioCard } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ApartmentInfoDto, UserRole } from "@komuna/types";
import { ApartmentTitle } from "../NewApartment/ApartmentTitle";
import type { CommonApartmentProps } from "./create-apartment.types";

export const ApartmentInfo = ({ aptDetails, updateField }: CommonApartmentProps<"apartmentInfo">) => {
  const { t } = useTranslation();
  
  const fields = useMemo(() => [
    { key: "name", title: t("create_apartment.apartment_info.apartment_name"), required: true, },
    { key: "address", title: t("create_apartment.apartment_info.apartment_address"), required: false, },
    { key: "city", title: t("create_apartment.apartment_info.city"), required: false, },
  ] as const, [t]);

  const roles = useMemo(() => [
    { value: UserRole.ROOMMATE, title: t("create_apartment.apartment_info.who_am_i.renter"), image: "/detailed_icons/renter.png" },
    { value: UserRole.LANDLORD, title: t("create_apartment.apartment_info.who_am_i.leaser"), image: "/detailed_icons/leaser.png" },
  ], [t]);

  return (
    <Stack width="100%" gap="6">
      <ApartmentTitle
        title={t('create_apartment.apartment_info.title')}
        description={t('create_apartment.apartment_info.description')}
      />
      {fields.map((field) => (
        <Field.Root key={field.key} required={field.required}>
          <Field.Label fontWeight="bold" fontSize="md">
            {field.title}
          </Field.Label>
          <Input
            value={aptDetails.apartmentInfo[field.key as keyof ApartmentInfoDto]}
            onChange={(e) => updateField(field.key, e.target.value)}
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
        defaultValue={aptDetails.apartmentInfo.role}
        onValueChange={({ value }) => updateField("role", value)}
      >
        <RadioCard.Label fontWeight="bold" fontSize="md">
          {t("create_apartment.apartment_info.who_am_i.title")}
        </RadioCard.Label>
        <HStack>
          {roles.map((role) => (
            <RadioCard.Item
              key={role.value}
              value={role.value}
            >
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <Image
                  height="130px"
                  src={role.image} />
                <RadioCard.ItemText>{role.title}</RadioCard.ItemText>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </HStack>
      </RadioCard.Root>
    </Stack >
  );
}

export default ApartmentInfo;

import { useTranslation } from "react-i18next";
import ApartmentLayout from "./ApartmentLayout"
import ApartmentTitle from "./ApartmentTitle";
import { Button, PinInput, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { times } from "lodash";
import { useNavigate } from "@tanstack/react-router";

const JoinApartment = () => {
  const [pincode, setPincode] = useState(['', '', '', '']);

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ApartmentLayout
      goBack={() => { navigate({ to: '/select-apartment' }); }}
    >
      <ApartmentTitle
        title={t("join_existing_apartment.title")}
        description={t("join_existing_apartment.description")}
      />
      <PinInput.Root
        otp
        autoFocus
        value={pincode}
        onValueChange={(e) => setPincode(e.value)}
        size="2xl"
        variant="outline"
      // onValueComplete={(details) => ({ code: details.valueAsString })}
      >
        <PinInput.HiddenInput />
        <PinInput.Control fontWeight="bold" fontSize="2xl" dir="ltr">
          {times(4, (i) => (
            <PinInput.Input key={i} index={i} background="white" fontSize="40px" />
          ))}
        </PinInput.Control>
      </PinInput.Root>
      <Spacer />
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold">
        {t('join_existing_apartment.join_btn')}
      </Button>
    </ApartmentLayout>
  );
}

export default JoinApartment;
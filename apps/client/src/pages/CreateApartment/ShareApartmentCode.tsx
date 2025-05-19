import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MutationState, useMutationState } from '@tanstack/react-query';
import { ApartmentTitle } from './ApartmentTitle';
import { Alert, Button, Clipboard, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import type { CreateApartmentHttpResponse, Code as CodeType } from '@komuna/types';

export const ShareApartmentCode: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ApartmentTitle
        title={t("create_apartment.share_apartment.title")}
        description={t("create_apartment.share_apartment.description")}
      />

      <VStack flexGrow={1}>
        <Codes />
      </VStack>

      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold">
        {t('create_apartment.share_apartment.close_btn')}
      </Button>
    </>
  );
}

const Codes: FC = () => {
  const { t } = useTranslation();

  const [mutationState] = useMutationState<MutationState<CreateApartmentHttpResponse>>({
    filters: { status: "success", mutationKey: ["createApartment"], },
  });

  const getValidCode = (code?: CodeType): string => {
    if (typeof code === "string") {
      return code;
    }
    else if (typeof code === "number") {
      return code.toString();
    }
    throw new Error("Invalid code type");
  }

  try {
    const roommateCode = getValidCode(mutationState.data?.roommateCode);
    const landlordCode = getValidCode(mutationState.data?.landlordCode);

    return (
      <>
        <Code code={roommateCode} description={t("create_apartment.share_apartment.roommate_description")} />
        <Spacer />
        <Code code={landlordCode} description={t("create_apartment.share_apartment.landlord_description")} />
      </>
    )
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{t("create_apartment.share_apartment.error")}</Alert.Title>
      </Alert.Root>
    )
  }

}

const Code: FC<{ code: string, description: string }> = ({ code, description }) => {
  return (
    <VStack borderRadius='lg'>
      <Text fontSize="lg" textAlign="center" >
        {description}
      </Text>
      <HStack>
        <Clipboard.Root value={code}>
          <Clipboard.Trigger asChild>
            <Button backgroundColor="transparent">
              <Clipboard.Indicator fontSize="2xl" />
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        <Text fontSize="7xl" fontWeight='bold' letterSpacing="widest">
          {code}
        </Text>
      </HStack>
    </VStack>
  );
}

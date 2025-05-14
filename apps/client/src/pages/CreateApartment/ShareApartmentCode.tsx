import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MutationState, useMutationState } from '@tanstack/react-query';
import { ApartmentTitle } from './ApartmentTitle';
import { Button, Clipboard, HStack, Spacer, Text } from '@chakra-ui/react';
import { CreateApartmentHttpResponse } from '@komuna/types';

const ShareApartmentCode: FC = () => {
  const { t } = useTranslation();

  const [mutationState] = useMutationState<MutationState<CreateApartmentHttpResponse>>({
    filters: {
      mutationKey: ['createApartment'],
    }
  });

  const getCode = (): string => {
    if (mutationState?.status === "success") {
      if (typeof mutationState?.data === "string") {
        return mutationState.data;
      }
      else if (typeof mutationState?.data === "number") {
        return mutationState.data.toString();
      }
    }
    return "6666";
  }

  const code = getCode();

  return (
    <>
      <ApartmentTitle
        title={t("create_apartment.share_apartment.title")}
        description={t("create_apartment.share_apartment.description")} />
      <HStack>
        <Clipboard.Root value={code}>
          <Clipboard.Trigger asChild>
            <Button position='fixed' margin="-40px" backgroundColor="transparent">
              <Clipboard.Indicator fontSize="2xl" />
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        <Text fontSize="7xl"
          fontWeight='bold'
          letterSpacing="widest">
          {code}
        </Text>
      </HStack >
      <Spacer />
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold">
        {t('create_apartment.share_apartment.close_btn')}
      </Button>
    </>
  );
}

export default ShareApartmentCode;

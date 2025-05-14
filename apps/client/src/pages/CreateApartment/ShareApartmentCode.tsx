import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutationState } from '@tanstack/react-query';
import ApartmentTitle from './ApartmentTitle';
import { Button, Clipboard, HStack, Spacer, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';

const ShareApartmentCode: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mutationState] = useMutationState({
    filters: {
      mutationKey: ['createApartment'],
    },
  });

  const shareCode = (typeof mutationState?.data !== 'object' ? mutationState.data : '6666') as string;
  // TODO better type check

  console.log('mutationState', mutationState);
  return (
    <>
      <ApartmentTitle
        title={t('create_apartment.share_apartment.title')}
        description={t('create_apartment.share_apartment.description')}
      />
      <HStack>
        <Clipboard.Root value={shareCode}>
          <Clipboard.Trigger asChild>
            <Button position="fixed" margin="-40px" backgroundColor="transparent">
              <Clipboard.Indicator fontSize="2xl" />
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        <Text fontSize="7xl" fontWeight="bold" letterSpacing="widest">
          {shareCode}
        </Text>
      </HStack>
      <Spacer />
      <Button size="xl" fontSize="2xl" fontWeight="bold" onClick={() => navigate({ to: '/roommate' })}>
        {t('create_apartment.share_apartment.close_btn')}
      </Button>
    </>
  );
};

export default ShareApartmentCode;

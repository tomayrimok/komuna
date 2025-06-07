import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MutationState, useMutationState } from '@tanstack/react-query';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { Alert, Button, Clipboard, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import type { CreateApartmentHttpResponse, Code as CodeType } from '@komuna/types';
import { useNavigate } from '@tanstack/react-router';
import { useRolePath } from '../../hooks/useRolePath';

export const ShareApartmentCode: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rolePath = useRolePath();

  return (
    <>
      <ApartmentTitle
        title={t('create_apartment.share_apartment.title')}
        description={t('create_apartment.share_apartment.description')}
      />

      <VStack flexGrow={1}>
        <Codes />
      </VStack>

      <Button size="xl" fontSize="2xl" fontWeight="bold" onClick={() => navigate({ to: rolePath })}>
        {t('create_apartment.share_apartment.to_app')}
      </Button>
    </>
  );
};

const Codes: FC = () => {
  const { t } = useTranslation();

  const [mutationState] = useMutationState<MutationState<CreateApartmentHttpResponse>>({
    filters: { status: 'success', mutationKey: ['createApartment'] },
  });

  const getValidCode = (code?: CodeType, allowNull = false): string | null => {
    if (typeof code === 'string') {
      return code;
    } else if (typeof code === 'number') {
      return code.toString();
    } else if (allowNull && code == null) {
      return null;
    }
    throw new Error('Invalid code type');
  };

  try {
    const roommateCode = getValidCode(mutationState.data?.roommateCode);
    const landlordCode = getValidCode(mutationState.data?.landlordCode, true);

    return (
      <>
        <Code code={roommateCode} description={t('create_apartment.share_apartment.roommate_description')} />
        <Spacer />
        <Code code={landlordCode} description={t('create_apartment.share_apartment.landlord_description')} />
      </>
    );
  } catch {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{t('create_apartment.share_apartment.error')}</Alert.Title>
      </Alert.Root>
    );
  }
};

const Code: FC<{ code: string | null; description: string }> = ({ code, description }) => {
  if (!code) {
    return null;
  }
  return (
    <VStack borderRadius="lg">
      <Text fontSize="lg" textAlign="center">
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

        <Text fontSize="7xl" fontWeight="bold" letterSpacing="widest">
          {code}
        </Text>
      </HStack>
    </VStack>
  );
};

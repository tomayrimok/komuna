import { Button, Field, Flex, Image, NumberInput, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCreatePayment } from '../../../hooks/useCreatePayment';
import { roundUpToXDigits } from '../../../utilities/roundUpToXDigits';
import { useAuth } from '../../../context/auth/AuthProvider';
import { User } from 'libs/types/src/generated/types.gen';
import ApartmentLayout from '../../../pages/NewApartment/ApartmentLayout';
import { useNavigate } from '@tanstack/react-router';

interface SettleUpDetailsProps {
  fromUser: User;
  toUser: User;
  debtAmount?: number;
}

export const SettleUpDetails: React.FC<SettleUpDetailsProps> = ({ debtAmount, fromUser, toUser }) => {
  const { mutate: createPayment, isPending } = useCreatePayment();
  const { t } = useTranslation();
  const [value, setValue] = useState<number>();
  const {
    sessionDetails: { apartmentId },
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (debtAmount) {
      setValue(debtAmount);
    }
  }, [debtAmount]);

  return (
    <ApartmentLayout goBack={() => navigate({ to: '/roommate/payments/settle-up' })} mt={0}>
      <Flex direction="column" gap="3" alignItems="center" justifyContent={'center'} height="100vh">
        <Image src="/meerkats/dealers.png" width="50vw" />
        <Text fontSize="3xl" fontWeight={'bold'}>
          {t('payments.payment-title')}
        </Text>
        {/* <br /> */}
        {/* <Flex gap="3" alignItems="center">
                        <Avatar.Root size="2xl" shape="full">
                            <Avatar.Image src={debtDetails.userFrom_image} alt={debtDetails.userFrom_firstName} />
                            <Avatar.Fallback name={`${debtDetails.userFrom_firstName} ${debtDetails.userFrom_lastName}`} />
                        </Avatar.Root>
                        <Icon>
                            <LuArrowLeft size={30} />
                        </Icon>
                        <Avatar.Root size="2xl" shape="full">
                            <Avatar.Image src={debtDetails.userTo_image} alt={debtDetails.userTo_firstName} />
                            <Avatar.Fallback name={`${debtDetails.userTo_firstName} ${debtDetails.userTo_lastName}`} />
                        </Avatar.Root>
                    </Flex> */}
        <Text fontSize={'xl'} textAlign={'center'}>
          <Trans i18nKey="payments.payment-made" values={{ payer: fromUser!.firstName, receiver: toUser!.firstName }} />
        </Text>
        <Field.Root w={'fit-content'} mb={6}>
          <Flex direction="row" gap="2" alignItems="center">
            <NumberInput.Root
              maxW="200px"
              defaultValue={String(roundUpToXDigits(debtAmount || 0))}
              onValueChange={(e) => setValue(Number(e.value))}
              min={0}
            >
              <NumberInput.Control />
              <NumberInput.Input placeholder="0.00" />
            </NumberInput.Root>
            <Text fontSize="xl">₪</Text>
          </Flex>
        </Field.Root>
        <Button
          variant="solid"
          colorScheme="blue"
          size="lg"
          disabled={isPending}
          onClick={() =>
            createPayment({
              amount: value ?? 0,
              fromId: fromUser!.userId,
              toId: toUser!.userId,
              apartmentId: apartmentId!,
            })
          }
        >
          {t('payments.settle-up')}
        </Button>
      </Flex>
    </ApartmentLayout>
  );
};

import { Avatar, Box, Button, Card, Flex, For, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useUserBalanceDetails } from '../../../hooks/useUserBalanceDetails';
import { useNavigate } from '@tanstack/react-router';
import UserCard from '../../General/userCard';
import { roundUpToXDigits } from '../../../utilities/roundUpToXDigits';
import { useAuth } from '../../../context/auth/AuthProvider';
import { useApartment } from '../../../hooks/useApartment';
import ApartmentLayout from '../../../pages/NewApartment/ApartmentLayout';

const SettleUpPage = () => {
  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();
  const { data, isLoading, isError } = useUserBalanceDetails();
  const navigate = useNavigate();
  const { data: apartmentData } = useApartment();

  const usersWithoutDebt = apartmentData?.residents?.filter((user) => {
    return (
      user.userId !== currentUserDetails?.userId &&
      data?.balanceDetails.every((debt) => {
        return debt.fromId !== user.userId && debt.toId !== user.userId;
      })
    );
  });

  return (
    <ApartmentLayout goBack={() => navigate({ to: '/roommate/payments' })} containerProps={{ gap: 2 }} mt={0}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="2">{t('payments.settle-up-title')}</Text>
      <Text as={'div'}>
        {!isLoading && data ? (
          !data.balanceDetails.length ? (
            <Text fontSize="lg" fontWeight="bold" mt="4">
              {t('payments.no-debts')}
            </Text>
          ) : (
            <Flex direction="column" gap="3" mt="4">
              <For each={data.balanceDetails}>
                {(item) => (
                  <UserCard
                    bg={"white"}
                    key={item.debtId}
                    user={item.debtor ? item.toUser : item.fromUser}
                    additionalComponent={
                      <Text whiteSpace={'pre-line'} textAlign="end" color={item.debtor ? 'red.600' : 'green.600'}>
                        {item.debtor
                          ? t('payments.you-owe', { amount: roundUpToXDigits(item.amount) })
                          : t('payments.owe-you', { amount: roundUpToXDigits(item.amount) })}
                      </Text>
                    }
                    onClick={() => {
                      navigate({ to: '/roommate/payments/settle-up/' + item.debtId });
                    }}
                  />
                )}
              </For>
            </Flex>
          )
        ) : (
          <SkeletonText noOfLines={2} width="100%" />
        )}
      </Text>
      {usersWithoutDebt?.length ? (
        <>
          <br />
          <hr />
          <Text fontSize="lg" fontWeight="bold" mt="4">
            {t('other-options')}
          </Text>
          <Stack gap={2} mt="1">
            {usersWithoutDebt.map((user) => (
              <UserCard
                bg={"white"}
                key={user.userId}
                user={user.user!}
                onClick={() => {
                  navigate({ to: '/roommate/payments/settle-up/user/' + user.userId });
                }}
                additionalComponent={
                  <Text whiteSpace={'pre-line'} textAlign="end" color={'gray.600'}>
                    {t('payments.no-debt')}
                  </Text>
                }
              />
            ))}
          </Stack>
        </>
      ) : null}

    </ApartmentLayout>
  );
};

export default SettleUpPage;

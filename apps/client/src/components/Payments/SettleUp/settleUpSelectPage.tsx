import { Avatar, Box, Button, Card, Flex, For, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/auth/AuthProvider';
import { useApartment } from '../../../hooks/useApartment';
import { useUserBalanceDetails } from '../../../hooks/useUserBalanceDetails';
import { roundUpToXDigits } from '../../../utilities/roundUpToXDigits';
import UserCard from '../../General/userCard';

const SettleUpPage = () => {
  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();
  const { data, isLoading, isError } = useUserBalanceDetails(currentUserDetails?.userId!);
  const navigate = useNavigate();
  const { data: apartmentData } = useApartment();

  const usersWithoutDebt = apartmentData?.residents?.filter((user) => {
    return (
      user.userId !== currentUserDetails?.userId &&
      data?.balanceDetails.every((debt) => {
        return debt.debt_fromId !== user.userId && debt.debt_toId !== user.userId;
      })
    );
  });

  return (
    <Card.Root width="100%">
      <Card.Body gap="2">
        <Card.Title mb="2">{t('payments.settle_up_title')}</Card.Title>
        <Card.Description as={'div'}>
          {!isLoading && data ? (
            !data.balanceDetails.length ? (
              <Text fontSize="lg" fontWeight="bold" mt="4">
                {t('payments.no_debts')}
              </Text>
            ) : (
              <Flex direction="column" gap="3" mt="4">
                <For each={data.balanceDetails}>
                  {(item) => (
                    <UserCard
                      key={item.debt_debtId}
                      user={
                        item.debtor
                          ? {
                              userId: item.userTo_firstName,
                              firstName: item.userTo_firstName,
                              lastName: item.userTo_lastName,
                              image: item.userTo_image,
                              phoneNumber: item.userTo_phoneNumber,
                            }
                          : {
                              firstName: item.userFrom_firstName,
                              lastName: item.userFrom_lastName,
                              image: item.userFrom_image,
                              phoneNumber: item.userFrom_phoneNumber,
                            }
                      }
                      additionalComponent={
                        <Text whiteSpace={'pre-line'} textAlign="end" color={item.debtor ? 'red.600' : 'green.600'}>
                          {item.debtor
                            ? t('payments.you_owe', { amount: roundUpToXDigits(item.debt_amount) })
                            : t('payments.owe_you', { amount: roundUpToXDigits(item.debt_amount) })}
                        </Text>
                      }
                      onClick={() => {
                        navigate({ to: '/roommate/payments/settle-up/' + item.debt_debtId });
                      }}
                    />
                  )}
                </For>
              </Flex>
            )
          ) : (
            <SkeletonText noOfLines={2} width="100%" />
          )}
        </Card.Description>
        {usersWithoutDebt?.length ? (
          <>
            <br />
            <hr />
            <Text fontSize="lg" fontWeight="bold" mt="4">
              {t('other_options')}
            </Text>
            <Stack gap={2} mt="2">
              {usersWithoutDebt.map(({ user, userId }) => (
                <UserCard
                  key={userId}
                  user={user}
                  onClick={() => {
                    navigate({ to: `/roommate/payments/settle-up/user/${userId}` });
                  }}
                  additionalComponent={
                    <Text whiteSpace={'pre-line'} textAlign="end" color={'gray.600'}>
                      {t('payments.no_debt')}
                    </Text>
                  }
                />
              ))}
            </Stack>
          </>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
};

export default SettleUpPage;

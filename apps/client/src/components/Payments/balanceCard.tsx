import { Box, Button, FormatNumber, SkeletonText, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { useUserBalanceDetails } from '../../hooks/useUserBalanceDetails';
import { roundUpToXDigits } from '../../utilities/roundUpToXDigits';
import BalanceText from './balanceText';

const BalanceCard = () => {
  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();

  const { data, isLoading } = useUserBalanceDetails();
  const navigate = useNavigate();

  return (
    <Box
      width="full"
      height={'23vh'}
      position={'relative'}
      overflow={'hidden'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box
        minW={'120vw'}
        height={'120vw'}
        borderRadius="50%"
        bg="brand.500"
        position={'absolute'}
        bottom={0}
        right={'-10vw'}
        zIndex={-1}
      />
      <BalanceText />
      {/* <Box as={"div"}>
                {!isLoading && data ?
                    <For each={data.balanceDetails}>
                        {(item) => (
                            <Stack key={item.debt_debtId} direction="row" gap="2" alignItems="center">
                                {item.debtor ?
                                    t('payments.you-owe-to', { amount: roundUpToXDigits(item.debt_amount), name: `${item.userTo_firstName} ${item.userTo_lastName[0]}` }) :
                                    t('payments.someone-owe-you', { amount: roundUpToXDigits(item.debt_amount), name: `${item.userFrom_firstName} ${item.userFrom_lastName[0]}` })
                                }
                            </Stack>
                        )}
                    </For>
                    :
                    <SkeletonText noOfLines={2} width="100%" />
                }
            </Box> */}
      {data?.balance !== 0 && (
        <Box justifyContent="flex-end">
          <Button
            mt={2}
            bg={'brand.10'}
            fontWeight={'bold'}
            onClick={() => {
              navigate({ to: '/roommate/payments/settle-up' });
            }}
          >
            {t('payments.settle-up')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BalanceCard;

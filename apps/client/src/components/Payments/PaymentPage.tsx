import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import BalanceCard from './balanceCard';
import Expenses from './expenses';
import CreateExpenseButton from './createExpenseButton';
import { useTranslation } from 'react-i18next';

const PaymentPage = () => {
  const { t } = useTranslation();

  return (
    <Stack paddingY="44px" paddingX="25px" gap="4" direction="row" wrap="wrap">
      <Box divideY={'1px'} width={'full'}>
        <Box pb={6}>
          <BalanceCard />
        </Box>
        <Box pt={6}>
          <Flex width={'full'} justifyContent={'space-between'} alignItems={'baseline'} mb={2}>
            <Text fontSize="xl" fontWeight="bold">
              {t('payments.expense.all_expenses')}
            </Text>
            <CreateExpenseButton />
          </Flex>
          <Expenses />
        </Box>
      </Box>
    </Stack>
  );
};

export default PaymentPage;

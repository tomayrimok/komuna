import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { roundUpToXDigits } from '../../utilities/roundUpToXDigits';
import { format, parseISO } from 'date-fns';
import { ApartmentExpensesResponse } from 'libs/types/src/generated';

interface ExpenseCardProps {
  item: ApartmentExpensesResponse;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { isRTL } = useLocaleChange();

  const month = format(parseISO(item.createdAt), 'M');
  const date = format(parseISO(item.createdAt), 'dd');

  return (
    <Box
      cursor={'pointer'}
      onClick={() => navigate({ to: `/roommate/payments/expenses/${item.expenseId}` })}
      width="100%"
      key={item.expenseId}
    >
      <Box py={2}>
        <Flex gap="3" alignItems="center" justifyContent="space-between">
          <Flex direction="column" alignItems={'center'} justifyContent="center" color={'gray.500'}>
            <Text fontSize="sm">{t(`month-short.${month}` as any)}</Text>
            <Text>{date}</Text>
          </Flex>
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            bg="white"
            border={'1px solid'}
            borderColor={'gray.300'}
            borderRadius="xl"
            color="gray.500"
            width="40px"
            height="40px"
          >
            💰
          </Flex>
          <Flex direction="column" flexGrow={1}>
            <Text fontSize="lg" fontWeight="medium">
              {item.description}
            </Text>
            <Box as="div" color={'gray.500'} fontSize="sm">
              {item.paidByMe
                ? t('payments.you-paid', { amount: roundUpToXDigits(item.amount) })
                : t('payments.paid-by', {
                    amount: roundUpToXDigits(item.amount),
                    name: `${item.paidByUser.firstName} ${item.paidByUser.lastName[0]}`,
                  })}
            </Box>
          </Flex>
          <Box
            as="div"
            whiteSpace="pre-line"
            textAlign="end"
            color={item.paidByMe ? 'green.600' : 'red.600'}
            fontSize="sm"
          >
            {item.paidByMe
              ? t('payments.you-lent', { amount: roundUpToXDigits(item.amount - Number(item.splitAmount)) })
              : t('payments.you-borrowed', { amount: roundUpToXDigits(item.splitAmount ?? 0) })}
          </Box>

          {/* <Icon rotate={isRTL ? "unset" : "180deg"} color={"gray.500"} size={"md"}>
                        <IconChevronLeft />
                    </Icon> */}
        </Flex>
      </Box>
    </Box>
  );
};

export default ExpenseCard;

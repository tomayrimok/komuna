import { Box, Flex, For, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { groupBy } from 'lodash';
import { useAuth } from '../../context/auth/AuthProvider';
import { useApartmentExpenses } from '../../hooks/useApartmentExpenses';

import ExpenseCard from './expenseCard';

// Get Hebrew month name with year: מרץ, 2025
const monthYearToLocale = (date: Date, locale: Intl.LocalesArgument) => {
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  const year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);

  return `${month}, ${year}`;
};

const Expenses = () => {
  const { t, i18n } = useTranslation();
  const { currentUserDetails } = useAuth();
  const { data, isLoading } = useApartmentExpenses(currentUserDetails?.userId);

  const groupedByMonth = groupBy(data?.apartmentExpenses || [], (obj) => {
    const date = new Date(obj.expense_createdAt);
    return monthYearToLocale(date, i18n.language);
  });

  return (
    <Flex gap="2" direction="column" width="100%">
      {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
      {data &&
        (!data.apartmentExpenses.length ? (
          <Text fontSize="l" fontWeight="bold" mb={2}>
            {t('payments.expense.no_expenses')}
          </Text>
        ) : (
          <For each={Object.entries(groupedByMonth)} fallback={<SkeletonText noOfLines={1} width="50%" mb="2" />}>
            {([monthYear, expenses]) => {
              return (
                <Box key={monthYear} mb={6}>
                  <Box fontSize="l" mb={2} color="gray.600">
                    {monthYear}
                  </Box>
                  <Stack gap={3}>
                    <For each={expenses}>{(item) => <ExpenseCard key={item.expense_expenseId} item={item} />}</For>
                  </Stack>
                </Box>
              );
            }}
          </For>
        ))}
    </Flex>
  );
};

export default Expenses;

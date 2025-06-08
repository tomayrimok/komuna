/* eslint-disable jsx-a11y/accessible-emoji */
import { Box, Button, Container, Flex, Heading, Loader, NumberInput, Stack, Text, Textarea } from '@chakra-ui/react';
import { ExpenseProvider, useExpense } from '../../context/payments/ExpenseProvider';
import { withWrappers } from '../../utilities/withWrappers';
import { useRouter } from '@tanstack/react-router';
import SelectUserDrawer from '../General/selectResidentDrawer';
import SplitDetailsDrawer from './SplitDetailsDrawer/splitDetailsDrawer';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ExpenseDetailsPage = () => {
  const {
    expenseDetails,
    setAmount,
    areSplitsValuesEqual,
    setPaidBy,
    setDescription,
    handleSave,
    expenseId,
    isExpenseDetailsLoading,
    isAddEditExpenseLoading,
  } = useExpense();

  const router = useRouter();
  const { t } = useTranslation();
  const [displayAmount, setDisplayAmount] = useState(expenseDetails.amount.toString());
  const buttonDisabled =
    !expenseDetails.amount ||
    !expenseDetails.description ||
    isExpenseDetailsLoading ||
    !expenseDetails.paidByUser ||
    isAddEditExpenseLoading;

  if (expenseId && isExpenseDetailsLoading) return <Loader />;

  return (
    <Box
      bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='40' y='40' font-size='80' fill='rgba(252, 219, 167, 0.37)' transform='rotate(30)'%3E₪%3C/text%3E%3C/svg%3E")`}
      bgRepeat="repeat"
      h="full"
      pt={7}
    >
      <Container maxW="lg" p={8} h="full" display="flex" flexDirection={'column'}>
        <Stack gap={6} flexGrow={1}>
          <Flex flexDirection={'column'} alignItems="center" gap={4}>
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              bg="white"
              border={'1px solid'}
              borderColor={'gray.300'}
              borderRadius="xl"
              color="gray.500"
              width="80px"
              height="80px"
              fontSize="5xl"
            >
              💰
            </Flex>
            <Heading size="2xl" textAlign="center">
              {expenseId ? t('payments.expense.edit-expense') : t('payments.expense.create-expense')}
            </Heading>
          </Flex>

          <Box p={6} borderWidth={1} borderRadius="xl" bg="white" h="full" display="flex" flexDirection={'column'}>
            <Stack gap={4} flexGrow={1}>
              <Box>
                <Text mb={1} fontWeight="bold">
                  {t('payments.expense.expense-description')}
                </Text>
                <Textarea
                  fontSize={'lg'}
                  rows={4}
                  // placeholder={t("payments.expense.expense-description")}
                  value={expenseDetails.description}
                  onChange={(e) => setDescription(e.target.value)}
                  resize={'none'}
                  variant={'flushed'}
                  alignContent={'end'}
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="bold">
                  {t('payments.expense.expense-amount')}
                </Text>
                <Flex alignItems="center" gap={2} position={'relative'}>
                  <NumberInput.Root
                    size="lg"
                    variant={'flushed'}
                    w={'full'}
                    formatOptions={{
                      //   style: 'currency',
                      //   currency: 'EUR',
                      //   currencyDisplay: 'code',
                      style: 'decimal',
                    }}
                    onValueChange={(e) => {
                      setDisplayAmount(e.value);
                      setAmount(e.valueAsNumber);
                    }}
                    // onValueChange={(e) => isNumber(e.value) && setAmount(Number(e.value))}
                    value={String(displayAmount)}
                  >
                    {/* <NumberInput.Control /> */}
                    <NumberInput.Input placeholder="0.00" fontSize={'2xl'} />
                  </NumberInput.Root>
                  <Text fontSize="2xl" position="absolute" left={2} top={1}>
                    ₪
                  </Text>
                </Flex>
              </Box>

              <Flex flexDirection={'column'} alignItems="center" gap={4} flexWrap="wrap" margin={'auto'}>
                <Text fontWeight="bold" fontSize={'sm'}>
                  {t('payments.expense.paid-by')}
                </Text>
                <SelectUserDrawer
                  size={'lg'}
                  title={t('payments.expense.select-paid-by')}
                  onSelect={setPaidBy}
                  trigger={
                    <Button size="2xl" px={4} py={1} h="unset" variant={'surface'} color="brand.800">
                      {expenseDetails.paidByUser?.firstName} {expenseDetails.paidByUser?.lastName}
                    </Button>
                  }
                />
                <Text fontWeight="bold" fontSize={'sm'}>
                  {t('payments.expense.and-splits')}
                </Text>
                <SplitDetailsDrawer
                  trigger={
                    <Button size="2xl" px={4} py={1} h="unset" variant={'surface'} color="brand.800">
                      {areSplitsValuesEqual ? t('payments.expense.equally') : t('payments.expense.unequally')}
                    </Button>
                  }
                />
              </Flex>
            </Stack>
            <Flex justifyContent="space-between" gap={3}>
              <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
                {t('cancel')}
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                disabled={buttonDisabled}
                size={'lg'}
                loading={isAddEditExpenseLoading}
              >
                {t('save')}
              </Button>
              {/* {expenseId &&
                        <Button colorScheme="red" variant="ghost" onClick={handleDelete}>
                            מחיקת הוצאה
                        </Button>
                    } */}
            </Flex>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default withWrappers(ExpenseDetailsPage, [ExpenseProvider]);

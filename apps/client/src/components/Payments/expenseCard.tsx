import { Card, Flex, Icon } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from '@tabler/icons-react';
import { useLocaleChange } from '../../hooks/useLocaleChange';
import { roundUpToXDigits } from '../../utilities/roundUpToXDigits';
import { ApartmentExpenseResponse } from '@komuna/types';

interface ExpenseCardProps {
  item: ApartmentExpenseResponse;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useLocaleChange();

  return (
    <Card.Root
      cursor={'pointer'}
      onClick={() => navigate({ to: `/roommate/payments/expenses/${item.expense_expenseId}` })}
      width="100%"
      key={item.expense_expenseId}
    >
      <Card.Body p={4}>
        <Flex gap="3" alignItems="center" justifyContent="space-between">
          <Flex direction="column" flexGrow={1}>
            <Card.Title>{item.expense_description}</Card.Title>
            <Card.Description as="div">
              {item.paidByMe
                ? t('payments.you_paid', { amount: roundUpToXDigits(item.expense_amount) })
                : t('payments.paid_by', {
                    amount: roundUpToXDigits(item.expense_amount),
                    name: `${item.paidByFirstName} ${item.paidByLastName[0]}`,
                  })}
            </Card.Description>
          </Flex>
          <Card.Description
            as="div"
            whiteSpace="pre-line"
            textAlign="end"
            color={item.paidByMe ? 'green.600' : 'red.600'}
          >
            {item.paidByMe
              ? t('payments.you_lent', { amount: roundUpToXDigits(item.expense_amount - Number(item.splitAmount)) })
              : t('payments.you_borrowed', { amount: roundUpToXDigits(item.splitAmount) })}
          </Card.Description>

          <Icon rotate={isRTL ? 'unset' : '180deg'} color={'gray.500'} size={'md'}>
            <IconChevronLeft />
          </Icon>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default ExpenseCard;

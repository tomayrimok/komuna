import { Button } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IconPlus } from '@tabler/icons-react';

const CreateExpenseButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/roommate/payments/expenses' });
  };

  return (
    <Button onClick={handleClick}>
      <IconPlus size={20} />
      {t('payments.expense.create_expense')}
    </Button>
  );
};

export default CreateExpenseButton;

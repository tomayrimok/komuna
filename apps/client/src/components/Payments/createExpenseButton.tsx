import { Button } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconMoneybagPlus } from '@tabler/icons-react';
import MainButton from '../mainButton';

interface CreateExpenseButtonProps {
  isFixed?: boolean;
}

const CreateExpenseButton: React.FC<CreateExpenseButtonProps> = ({ isFixed = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/roommate/payments/expenses' });
  };

  return (
    <MainButton isFixed={isFixed} onClick={handleClick} >
      <IconMoneybagPlus size={20} />
      {t('payments.expense.create-expense')}
    </MainButton>
  );
};

export default CreateExpenseButton;

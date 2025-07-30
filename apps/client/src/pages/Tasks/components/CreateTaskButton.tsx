import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import MainButton from '../../../components/mainButton';
import { IconFlagPlus } from '@tabler/icons-react';
import { useAuth } from '../../../context/auth/AuthProvider';

interface CreateTaskButtonProps {
  isFixed?: boolean;
}

export const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ isFixed = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    sessionDetails: { role },
  } = useAuth();

  const handleClick = () => {
    navigate({ to: `/${role?.toLowerCase()}/tasks/details` });
  };

  return (
    <MainButton onClick={handleClick} isFixed={isFixed}>
      <IconFlagPlus size={20} />
      {t('tasks.create_task')}
    </MainButton>
  );
};

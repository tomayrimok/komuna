import { IconFlagPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import MainButton from '../../components/mainButton';

interface CreateTaskButtonProps {
  isFixed?: boolean;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ isFixed = true }) => {
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

export default CreateTaskButton;

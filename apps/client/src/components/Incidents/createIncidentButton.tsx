import { Button } from '@chakra-ui/react';
import { IconFlagPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import MainButton from '../mainButton';

interface CreateIncidentButtonProps {
  isFixed?: boolean;
}

const CreateIncidentButton: React.FC<CreateIncidentButtonProps> = ({ isFixed = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    sessionDetails: { role },
  } = useAuth();

  const handleClick = () => {
    navigate({ to: `/${role?.toLowerCase()}/incident/details` });
  };

  return (
    <MainButton onClick={handleClick} isFixed={isFixed}>
      <IconFlagPlus size={20} />
      {t('incidents.create_incident')}
    </MainButton>
  );
};

export default CreateIncidentButton;

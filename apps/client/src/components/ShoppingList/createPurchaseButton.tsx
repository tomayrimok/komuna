import { Button, Drawer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import MainButton from '../mainButton';

interface CreatePurchaseButtonProps {
  isFixed?: boolean;
}

const CreatePurchaseButton: React.FC<CreatePurchaseButtonProps> = ({ isFixed = true }) => {
  const { t } = useTranslation();

  return (
    <Drawer.Trigger asChild>
      <MainButton isFixed={isFixed}>
        <IconShoppingCartPlus size={20} />
        {t('shopping.make_purchase')}
      </MainButton>
    </Drawer.Trigger >
  );
};

export default CreatePurchaseButton;

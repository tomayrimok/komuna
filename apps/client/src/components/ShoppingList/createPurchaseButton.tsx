import { Button, Drawer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import MainButton from '../mainButton';
import { ContextType } from '@komuna/types';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';

interface CreatePurchaseButtonProps {
  isFixed?: boolean;
  contextType?: ContextType;
}

const CreatePurchaseButton: React.FC<CreatePurchaseButtonProps> = ({ isFixed = true, contextType }) => {
  const { t } = useTranslation();
  const { setContextType } = useShoppingList();

  return (
    <Drawer.Trigger asChild>
      <MainButton isFixed={isFixed}
        onClick={() => {
          if (contextType) {
            setContextType?.(contextType);
          }
        }}>
        <IconShoppingCartPlus size={20} />
        {t('shopping.make_purchase')}
      </MainButton>
    </Drawer.Trigger >
  );
};

export default CreatePurchaseButton;

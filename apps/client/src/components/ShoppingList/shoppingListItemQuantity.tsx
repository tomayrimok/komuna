import { Flex, IconButton, Text } from '@chakra-ui/react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ShoppingListItemQuantityProps {
  handleChange: (amount: number) => void;
  amount?: number;
  isPurchased?: boolean;
  disabled?: boolean;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({
  amount = 1,
  handleChange,
  isPurchased,
  disabled,
}) => {
  const { t } = useTranslation();
  const oncChange = (newAmount: number) => {
    if (newAmount < 1) {
      newAmount = 1;
    }
    handleChange(newAmount);
  };

  return (
    <Flex alignItems={'center'}>
      {!isPurchased && (
        <IconButton
          disabled={amount <= 1 || disabled}
          variant={'subtle'}
          size={'2xs'}
          color={'gray.500'}
          onClick={() => oncChange(amount - 1)}
        >
          <IconMinus />
        </IconButton>
      )}

      <Text mx={1} whiteSpace="nowrap">
        {amount} {t('shopping.quantity')}
      </Text>

      {!isPurchased && (
        <IconButton variant={'subtle'} size={'2xs'} color={'gray.500'} onClick={() => oncChange(amount + 1)} disabled={disabled}>
          <IconPlus />
        </IconButton>
      )}
    </Flex>
  );
};

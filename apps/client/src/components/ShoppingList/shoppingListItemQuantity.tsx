import { Flex, IconButton, Text } from '@chakra-ui/react';
import { IconMinus, IconPlus } from '@tabler/icons-react';

interface ShoppingListItemQuantityProps {
  handleChange: (amount: number) => void;
  amount?: number;
  isPurchased?: boolean;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({
  amount = 1,
  handleChange,
  isPurchased,
}) => {
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
          disabled={amount <= 1}
          variant={'subtle'}
          size={'2xs'}
          color={'gray.500'}
          onClick={() => oncChange(amount - 1)}
        >
          <IconMinus />
        </IconButton>
      )}

      <Text mx={1} whiteSpace="nowrap">
        {amount} יח׳
      </Text>

      {!isPurchased && (
        <IconButton variant={'subtle'} size={'2xs'} color={'gray.500'} onClick={() => oncChange(amount + 1)}>
          <IconPlus />
        </IconButton>
      )}
    </Flex>
  );
};

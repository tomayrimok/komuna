import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { IconChevronDown, IconMinus, IconPlus } from '@tabler/icons-react';

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
  return (
    <Flex alignItems={'center'}>
      {!isPurchased && (
        <IconButton
          disabled={amount <= 1}
          variant={'subtle'}
          size={'2xs'}
          color={'gray.500'}
          onClick={() => handleChange(amount - 1)}
        >
          <IconMinus />
        </IconButton>
      )}

      <Text mx={1} whiteSpace="nowrap">
        {amount} יח׳
      </Text>

      {!isPurchased && (
        <IconButton variant={'subtle'} size={'2xs'} color={'gray.500'} onClick={() => handleChange(amount + 1)}>
          <IconPlus />
        </IconButton>
      )}
    </Flex>
  );
};

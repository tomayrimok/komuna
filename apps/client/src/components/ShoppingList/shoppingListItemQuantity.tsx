import { Flex, IconButton, Text } from '@chakra-ui/react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface ShoppingListItemQuantityProps {
  handleChange: (amount: number) => void;
  amount?: number;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({ amount = 1, handleChange }) => {
  const oncChange = (newAmount: number) => {
    if (newAmount < 1) {
      newAmount = 1;
    }
    handleChange(newAmount);
  };

  return (
    <Flex alignItems={'center'}>
      <IconButton variant={'subtle'} size={'2xs'} color={'gray.500'} onClick={() => oncChange(amount - 1)}>
        <IconChevronDown />
      </IconButton>
      <Text mx={1}>{amount}</Text>
      <IconButton variant={'subtle'} size={'2xs'} color={'gray.500'} onClick={() => oncChange(amount + 1)}>
        <IconChevronUp />
      </IconButton>
    </Flex>
  );
};

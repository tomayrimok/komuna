import { IconButton } from '@chakra-ui/react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

interface ShoppingListItemIsUrgentProps {
  handleChange: (isUrgent: boolean) => void;
  isUrgent?: boolean;
  disabled?: boolean;
}
export const ShoppingListItemIsUrgent: React.FC<ShoppingListItemIsUrgentProps> = ({
  isUrgent = false,
  handleChange,
  disabled,
}) => {
  return (
    <IconButton
      aria-label={isUrgent ? 'Remove urgent' : 'Mark urgent'}
      variant="ghost"
      color={isUrgent ? 'orange' : 'gray'}
      onClick={() => handleChange(!isUrgent)}
      size="xs"
      ms={1}
      disabled={disabled}
    >
      {isUrgent ? <IconStarFilled /> : <IconStar />}
    </IconButton>
  );
};

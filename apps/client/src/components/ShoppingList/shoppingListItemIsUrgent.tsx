import { IconButton } from '@chakra-ui/react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

interface ShoppingListItemIsUrgentProps {
  handleChange: (isUrgent: boolean) => void;
  isUrgent?: boolean;
}
export const ShoppingListItemIsUrgent: React.FC<ShoppingListItemIsUrgentProps> = ({
  isUrgent = false,
  handleChange,
}) => {
  return (
    <IconButton
      aria-label={isUrgent ? 'Remove urgent' : 'Mark urgent'}
      variant="ghost"
      color={isUrgent ? 'orange' : 'gray'}
      onClick={() => handleChange(!isUrgent)}
      size="2xs"
      ms={1}
    >
      {isUrgent ? <IconStarFilled /> : <IconStar />}
    </IconButton>
  );
};

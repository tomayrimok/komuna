import { Box, IconButton } from "@chakra-ui/react";
import { IconChevronUp } from "@tabler/icons-react";

interface ShoppingListItemQuantityProps {
    itemId: string;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({ itemId }) => {


    return (
        <Box>
            <IconButton>
                <IconChevronUp
                    onClick={() => setNewItem({ ...newItem, amount: (newItem.amount || 1) + 1 })}
                    size="sm"
                    color="gray.500"
                />
            </IconButton>
        </Box>
    );
}
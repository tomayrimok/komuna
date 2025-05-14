import { Box, IconButton } from "@chakra-ui/react";
import { IconChevronUp } from "@tabler/icons-react";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";

interface ShoppingListItemQuantityProps {
    itemId: string;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({ itemId }) => {

    const { setNewItem, newItem } = useShoppingList();

    return (
        <Box>
            <IconButton>
                <IconChevronUp
                    onClick={() => setNewItem({ ...newItem, amount: (newItem?.amount || 1) + 1 })}
                    size="sm"
                    color="gray.500"
                />
            </IconButton>
        </Box>
    );
}
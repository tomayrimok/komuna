import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface ShoppingListItemQuantityProps {
    handleChange: (amount: number) => void;
    amount?: number;
}

export const ShoppingListItemQuantity: React.FC<ShoppingListItemQuantityProps> = ({ amount = 1, handleChange }) => {


    return (
        <Flex alignItems={"center"} >
            <IconButton
                variant={"subtle"}
                size={"2xs"}
                color={"gray.500"}
                onClick={() => handleChange(amount + 1)}
            >
                <IconChevronUp />
            </IconButton>

            <Text mx={1}>
                {amount}
            </Text>

            <IconButton
                variant={"subtle"}
                size={"2xs"}
                color={"gray.500"}
                onClick={() => handleChange(amount - 1)}
            >
                <IconChevronDown />
            </IconButton>
        </Flex>
    );
}
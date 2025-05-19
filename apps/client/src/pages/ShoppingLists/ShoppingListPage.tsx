import {
    Box,
    Button,
    Card,
    Flex,
    Icon,
    IconButton,
    Input,
    Loader,
    Text
} from "@chakra-ui/react";
import { IconPlus, IconShoppingCart } from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useEffect, useRef } from "react";
import { ShoppingListItem } from "../../components/ShoppingList/shoppingListItem";
import { ShoppingListItemIsUrgent } from "../../components/ShoppingList/shoppingListItemIsUrgent";
import { ShoppingListItemQuantity } from "../../components/ShoppingList/shoppingListItemQuantity";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";

const NEW_ITEM_DEFAULT = {
    itemId: "",
    name: "",
    amount: 1,
    isUrgent: false,
    isPurchased: false,
    createdAt: new Date(),
};

const ShoppingListPage: React.FC = () => {

    const addFormRef = useRef<HTMLDivElement>(null);
    const {
        items,
        newItem,
        updateOrder,
        setNewItem,
        handleAddItem,
        openEditDrawer,
        isShoppingListLoading,
    } = useShoppingList();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (addFormRef.current && !addFormRef.current.contains(event.target as Node) && newItem) {
                handleAddItem();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newItem]);


    return (
        <Flex p={8} flexDirection={"column"} py={4} h="100%">
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">Shopping List</Text>
                <IconButton
                    aria-label="Add Item"
                    colorScheme="blue"
                    onClick={() => setNewItem(NEW_ITEM_DEFAULT)}
                >
                    <IconPlus />
                </IconButton>
            </Flex>

            {newItem && (
                <Card.Root borderWidth="1px" borderRadius="lg" mb="4" ref={addFormRef} boxShadow="md">
                    <Box p={3}>
                        <Input
                            placeholder="Item name"
                            value={newItem.name || ""}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            mb={3}
                            autoFocus
                        />

                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2}>
                                <ShoppingListItemQuantity
                                    handleChange={(amount) => {
                                        setNewItem({ ...newItem, amount });
                                    }}
                                    amount={newItem.amount}
                                />
                            </Flex>

                            <Flex gap={2}>
                                <ShoppingListItemIsUrgent handleChange={(isUrgent) => {
                                    setNewItem({ ...newItem, isUrgent });
                                }}
                                    isUrgent={newItem.isUrgent}
                                />
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={handleAddItem}
                                    disabled={!newItem.name?.trim()}
                                >
                                    Add
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Card.Root>
            )}

            <Reorder.Group
                axis="y"
                values={items}
                onReorder={updateOrder}
            >

                {items.map((item) => {
                    return (
                        <Reorder.Item
                            key={item.itemId}
                            value={item}
                        >
                            <ShoppingListItem
                                key={item.itemId}
                                item={item}
                                openEditDrawer={openEditDrawer}
                            />
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>


            {isShoppingListLoading ?
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    h="200px"
                    color="gray.500"
                >
                    <Loader />
                </Flex>
                :
                items.length === 0 && !newItem ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        color="gray.500"
                        flexGrow={1}
                    >
                        <Icon width={16} height={16} mb={3}>
                            <IconShoppingCart />
                        </Icon>
                        <Text mb={3}>Your shopping list is empty</Text>
                    </Flex>
                )
                    : null
            }
        </Flex >
    );
};

export default ShoppingListPage;
import {
    Box,
    Input,
    Flex,
    Text,
    Container,
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    // DrawerOverlay,
    DrawerContent,
    // DrawerCloseButton,
    Card,
    IconButton,
    // NumberInputField,
    // useBoolean
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IconStar, IconStarFilled, IconPlus } from "@tabler/icons-react";
import { ShoppingList, ShoppingListContextType, ShoppingListItemDto } from "@komuna/types";
import { API } from "../../axios";
import { toaster } from "../../chakra/ui/toaster";
import { ShoppingListItem } from "../../components/ShoppingList/shoppingListItem";


interface ShoppingListPageProps {
    contextType?: ShoppingListContextType;
    data: ShoppingList;
}

export const ShoppingListPage: React.FC<ShoppingListPageProps> = ({ contextType, data }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [items, setItems] = useState(data?.items || []);
    const [editingItem, setEditingItem] = useState<ShoppingListItemDto | null>(null);
    const [newItem, setNewItem] = useState<Partial<ShoppingListItemDto> | null>(null);
    const addFormRef = useRef<HTMLDivElement>(null);

    // Track which item is currently being swiped to prevent multiple swipes
    const [activeSwipe, setActiveSwipe] = useState<string | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (addFormRef.current && !addFormRef.current.contains(event.target as Node) && newItem) {
                handleAddItem();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newItem]);

    const updateItem = async (itemId: string, itemData: Partial<ShoppingListItemDto>) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.itemId === itemId ? { ...item, ...itemData } : item))
        );
        try {
            await API.post("/shopping-list/update-item", {
                itemId,
                itemData,
                contextType,
            });
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to update item",
            });
        }
    };

    const handleAddItem = async () => {
        if (newItem?.name?.trim()) {
            try {
                const response = await API.post("/shopping-list/add-item", {
                    itemData: newItem,
                    contextType,
                });
                setItems(response.data);
                setNewItem(null);
            } catch (error) {
                toaster.error({
                    title: "Error",
                    description: "Failed to add item",
                });
            }
        } else {
            setNewItem(null);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await API.post("/shopping-list/delete-item", { itemId, contextType });
            setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
            setActiveSwipe(null);
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to delete item",
            });
        }
    };

    const handleEditItem = () => {
        if (editingItem) {
            updateItem(editingItem.itemId, {
                name: editingItem.name,
                amount: editingItem.amount,
                isUrgent: editingItem.isUrgent
            });
            setEditingItem(null);
            setDrawerOpen(false);
        }
    };

    const openEditDrawer = (item: ShoppingListItemDto) => {
        setEditingItem({ ...item });
        setDrawerOpen(true)
    };

    const sortedItems = [...items].sort((a, b) => {
        // sort by isPurchased and then by createdAt

        if (a.isPurchased !== b.isPurchased) {
            return a.isPurchased ? 1 : -1;
        }
        if (a.createdAt > b.createdAt) {
            return -1;
        }
        return 1


        // // Sort by purchased status first
        // if (a.isPurchased !== b.isPurchased) {
        //     return a.isPurchased ? 1 : -1;
        // }
        // // Then by urgency
        // if (a.isUrgent !== b.isUrgent) {
        //     return a.isUrgent ? -1 : 1;
        // }
        // // Then alphabetically
        // return a.name.localeCompare(b.name);
    });

    return (
        <Container maxW="md" py={4}>
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">Shopping List</Text>
                <IconButton
                    aria-label="Add Item"
                    colorScheme="blue"
                    onClick={() => {
                        setNewItem({
                            itemId: "",
                            name: "",
                            amount: 1,
                            isUrgent: false,
                            isPurchased: false,
                            createdAt: new Date(),
                        });
                    }}
                >
                    <IconPlus />
                </IconButton>
            </Flex>

            {sortedItems.map((item) => {


                return (
                    <ShoppingListItem key={item.itemId} item={item} openEditDrawer={openEditDrawer} updateItem={updateItem} setActiveSwipe={setActiveSwipe} />
                );
            })}

            {newItem && (
                <Card.Root borderWidth="1px" borderRadius="lg" mb="4" ref={addFormRef} boxShadow="md">
                    <Box p={3}>
                        <Text fontSize="sm" fontWeight="medium" mb={2}>New Item</Text>
                        <Input
                            placeholder="Item name"
                            value={newItem.name || ""}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            mb={3}
                            autoFocus
                        />

                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2}>
                                <Text fontSize="sm">Quantity:</Text>
                                {/* <NumberInput
                                    value={newItem.amount || 1}
                                    min={1}
                                    max={99}
                                    size="sm"
                                    w="80px"
                                    onChange={(valueAsString, valueAsNumber) =>
                                        setNewItem({ ...newItem, amount: valueAsNumber })
                                    }
                                >
                                    <NumberInputField />
                                    <Box display="flex" flexDirection="column" position="absolute" right="0" top="0" height="100%" width="20px">
                                        <Button size="xs" height="50%" fontSize="xs" p={0} borderRadius="0" borderTopRightRadius="md"
                                            onClick={() => setNewItem({ ...newItem, amount: (newItem.amount || 1) + 1 })}>+</Button>
                                        <Button size="xs" height="50%" fontSize="xs" p={0} borderRadius="0" borderBottomRightRadius="md"
                                            onClick={() => setNewItem({ ...newItem, amount: Math.max(1, (newItem.amount || 1) - 1) })}>-</Button>
                                    </Box>
                                </NumberInput> */}
                            </Flex>

                            <Flex gap={2}>
                                <IconButton
                                    aria-label={newItem.isUrgent ? "Remove urgent" : "Mark urgent"}
                                    variant="ghost"
                                    color={newItem.isUrgent ? "orange" : "gray"}
                                    onClick={() => setNewItem({ ...newItem, isUrgent: !newItem.isUrgent })}
                                    size="sm"
                                >
                                    {newItem.isUrgent ? <IconStarFilled /> : <IconStar />}
                                </IconButton>
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

            {/* Edit Item Drawer */}
            <Drawer.Root
                open={isDrawerOpen}
                placement="bottom"
            // onClose={() => {
            //     setDrawerOpen.off();
            //     setEditingItem(null);
            // }}
            >
                {/* <DrawerOverlay /> */}
                <DrawerContent borderTopRadius="lg">
                    <Drawer.CloseTrigger />
                    <DrawerHeader>Edit Item</DrawerHeader>
                    <DrawerBody pb={6}>
                        {editingItem && (
                            <Box>
                                <Input
                                    placeholder="Item name"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    mb={4}
                                />

                                <Flex justify="space-between" align="center" mb={4}>
                                    <Text>Quantity:</Text>
                                    {/* <NumberInput
                                        value={editingItem.amount}
                                        min={1}
                                        max={99}
                                        w="100px"
                                        onChange={(valueAsString, valueAsNumber) =>
                                            setEditingItem({ ...editingItem, amount: valueAsNumber })
                                        }
                                    >
                                        <NumberInputField />
                                        <Box display="flex" flexDirection="column" position="absolute" right="0" top="0" height="100%" width="20px">
                                            <Button size="xs" height="50%" fontSize="xs" p={0} borderRadius="0" borderTopRightRadius="md"
                                                onClick={() => setEditingItem({ ...editingItem, amount: editingItem.amount + 1 })}>+</Button>
                                            <Button size="xs" height="50%" fontSize="xs" p={0} borderRadius="0" borderBottomRightRadius="md"
                                                onClick={() => setEditingItem({ ...editingItem, amount: Math.max(1, editingItem.amount - 1) })}>-</Button>
                                        </Box>
                                    </NumberInput> */}
                                </Flex>

                                <Flex justify="space-between" align="center" mb={6}>
                                    <Text>Urgent:</Text>
                                    {/* <Checkbox
                                        isChecked={editingItem.isUrgent}
                                        onChange={() => setEditingItem({ ...editingItem, isUrgent: !editingItem.isUrgent })}
                                        size="lg"
                                    /> */}
                                </Flex>

                                <Flex justify="space-between">
                                    <Button
                                        variant="outline"
                                        colorScheme="red"
                                        onClick={() => {
                                            handleDeleteItem(editingItem.itemId);
                                            setDrawerOpen(false)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleEditItem}
                                        disabled={!editingItem.name.trim()}
                                    >
                                        Save
                                    </Button>
                                </Flex>
                            </Box>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer.Root>

            {items.length === 0 && !newItem && (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    h="200px"
                    color="gray.500"
                >
                    <Text mb={3}>Your shopping list is empty</Text>
                    <Text fontSize="sm">Tap the + button to add items</Text>
                </Flex>
            )}
        </Container>
    );
};
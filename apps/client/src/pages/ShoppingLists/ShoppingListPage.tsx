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
    Loader,
    Icon,
    // NumberInputField,
    // useBoolean
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IconStar, IconStarFilled, IconPlus, IconChevronUp, IconShoppingCart } from "@tabler/icons-react";
import { ShoppingList, ShoppingListContextType, ShoppingListItemDto } from "@komuna/types";
import { API } from "../../axios";
import { toaster } from "../../chakra/ui/toaster";
import { ShoppingListItem } from "../../components/ShoppingList/shoppingListItem";
import { useShoppingListQuery } from "../../hooks/query/useShoppingListQuery";
import { ShoppingListProvider, useShoppingList } from "../../context/auth/ShoppingListProvider";
import { ShoppingListItemQuantity } from "../../components/ShoppingList/shoppingListItemQuantity";
import { ShoppingListItemIsUrgent } from "../../components/ShoppingList/shoppingListItemIsUrgent";
import { Reorder } from "framer-motion";

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
        setItems,
        setNewItem,
        editingItem,
        setEditingItem,
        setDrawerOpen,
        isDrawerOpen,
        handleAddItem,
        handleDeleteItem,
        handleEditItem,
        openEditDrawer,
        updateItem,
        setActiveSwipe,
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

    // const sortedItems = [...items].sort((a, b) => {
    // sort by isPurchased and then by createdAt

    // return (a.isPurchased ? 1 : 0) - (b.isPurchased ? 1 : 0);

    // if (a.isPurchased !== b.isPurchased) {
    //     return a.isPurchased ? 1 : -1;
    // }
    // if (a.createdAt > b.createdAt) {
    //     return -1;
    // }
    // return 1


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
    // });


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
                        {/* <Text fontSize="sm" fontWeight="medium" mb={2}>New Item</Text> */}
                        <Input
                            placeholder="Item name"
                            value={newItem.name || ""}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            mb={3}
                            autoFocus
                        />

                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={2}>
                                {/* <IconButton>
                                    <IconChevronUp
                                        onClick={() => setNewItem({ ...newItem, amount: (newItem.amount || 1) + 1 })}
                                        size="sm"
                                        color="gray.500"
                                    />
                                </IconButton> */}
                                <ShoppingListItemQuantity
                                    handleChange={(amount) => {
                                        setNewItem({ ...newItem, amount });
                                    }}
                                    amount={newItem.amount}
                                />
                                {/* <IconButton>
                                    <IconChevronDown
                                        onClick={() => setNewItem({ ...newItem, amount: Math.max(1, (newItem.amount || 1) - 1) })}
                                        size="sm"
                                        color="gray.500"
                                    />
                                </IconButton> */}
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
                onReorder={setItems}

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
                                updateItem={updateItem}
                            />
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>



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
                        {/* <Text fontSize="sm">Tap the + button to add items</Text> */}
                    </Flex>
                )
                    : null
            }
        </Flex >
    );
};

export default ShoppingListPage;
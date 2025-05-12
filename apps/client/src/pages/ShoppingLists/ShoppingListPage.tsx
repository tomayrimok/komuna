import { Box, Input, IconButton, Flex, Text, Checkbox, Icon, Card, Container } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IconStar, IconStarFilled, IconChevronDown, IconChevronUp, IconPlus } from "@tabler/icons-react";
import { ShoppingList, ShoppingListContextType, ShoppingListItemDto } from "@komuna/types";
import { API } from "../../axios";
import { toaster } from "../../chakra/ui/toaster";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface ShoppingListPageProps {
    contextType?: ShoppingListContextType;
    data: ShoppingList;
}

export const ShoppingListPage: React.FC<ShoppingListPageProps> = ({ contextType, data }) => {
    const addBoxRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState(data?.items);
    const [newItem, setNewItem] = useState<Partial<ShoppingListItemDto> | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (addBoxRef.current && !addBoxRef.current.contains(event.target as Node)) {
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
            })
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to update item",
            });
        }
    }

    const updateNewItem = async (itemData: Partial<ShoppingListItemDto>) => {
        setNewItem((prevItem => ({
            ...prevItem,
            ...itemData
        })))
    }

    const handleAddItem = async () => {
        if (newItem?.name?.trim()) {
            try {
                const response = await API.post("/shopping-list/add-item", {
                    itemData: newItem,
                    contextType,
                });
                setItems((prevItems) => response.data);
                setNewItem(null);
            } catch (error) {
                toaster.error({
                    title: "Error",
                    description: "Failed to add item",
                });
            }
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await API.post("/shopping-list/delete-item", { itemId, contextType });
            setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to delete item",
            });
        }
    };


    return (
        <Container>

            {items?.map((item) => {
                const x = useMotionValue(0);
                // const background = useTransform(x, [-100, 0, 100], ["red", "white", "white"]);

                return (

                    <Box key={item.itemId} position="relative" overflow="hidden" mb="4" borderRadius="lg">
                        {/* Red background revealed on right swipe */}
                        <Box
                            position="absolute"
                            top="0"
                            bottom="0"
                            left="0"
                            right="0"
                            bg="red.500"
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            pr={4}
                            borderRadius="lg"
                            zIndex={0}
                        >
                            <Text
                                color="white"
                                fontWeight="bold"
                                cursor="pointer"
                                onClick={() => handleDeleteItem(item.itemId)}
                            >
                                Delete
                            </Text>
                        </Box>

                        {/* Foreground swipable card */}
                        <motion.div
                            drag="x"
                            variants={
                                {
                                    initial: { x: 0 },
                                    drag: { x: 0 },
                                    exit: { x: 100 },
                                }
                            }
                            dragConstraints={{ left: 0, right: 100 }}
                            dragElastic={0}
                            style={{ x, zIndex: 1 }}
                            onDrag={(e, info) => {
                                // Prevent dragging to the left
                                // if (info.point.x < info.offset.x) {
                                //     x.set(0);
                                // }
                            }}
                            onDragEnd={(event, info) => {
                                console.log('info :', info);
                                // Snap back if not far enough
                                console.log('info.offset.x :', info.offset.x);
                                if (info.offset.x < 100) {
                                    x.set(0);
                                }


                            }}
                        >
                            <Card.Root borderWidth="1px" borderRadius="lg" bg="white">
                                <Card.Body p={2}>
                                    <Flex justify="space-between" align="center">
                                        <Flex align="center" gap={2}>
                                            <Checkbox.Root
                                                checked={item.isPurchased}
                                                variant="outline"
                                                onChange={() =>
                                                    updateItem(item.itemId, { isPurchased: !item.isPurchased })
                                                }
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label />
                                            </Checkbox.Root>
                                            <Text fontWeight="bold">{item.name}</Text>
                                        </Flex>
                                        <Icon onClick={() => updateItem(item.itemId, { isUrgent: !item.isUrgent })}>
                                            {item.isUrgent ? <IconStarFilled /> : <IconStar />}
                                        </Icon>
                                    </Flex>
                                    <Text mt={2}>Amount: {item.amount}</Text>
                                </Card.Body>
                            </Card.Root>
                        </motion.div>
                    </Box>
                );
            })}

            {newItem && (
                <Card.Root borderWidth="1px" borderRadius="lg" mb="4" ref={addBoxRef}>
                    <Card.Body p={2}>
                        <Flex justify="space-between" align="center">
                            <Input
                                placeholder="Item name"
                                value={newItem.name}
                                onChange={(e) => updateNewItem({ name: e.target.value })}
                                maxW="200px"
                            />

                            <Icon onClick={() => updateNewItem({ isUrgent: !newItem.isUrgent })}>
                                {newItem.isUrgent ? <IconStarFilled /> : <IconStar />}
                            </Icon>
                        </Flex>
                        <p>Amount: {newItem.amount}</p>
                    </Card.Body>
                </Card.Root>
            )}

            <IconButton
                aria-label="Add Item"

                onClick={() => {
                    setNewItem({
                        itemId: "",
                        name: "",
                        amount: 1,
                        isUrgent: false,
                        isPurchased: false,
                    });
                }}
            >
                <IconPlus />
            </IconButton>

            {/* <Box p="4" borderWidth="1px" borderRadius="lg" mb="4" ref={addBoxRef}>
                <Text mb="2" fontWeight="bold">Add New Item</Text>
                <Flex align="center" gap="2">
                    <Input
                        placeholder="Item name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        maxW="200px"
                    />

                    <Icon onClick={() => setIsUrgent((prev) => !prev)}>
                        {isUrgent ? <IconStarFilled /> : <IconStar />}
                    </Icon>
                    <Flex direction="column" align="center">
                        <IconButton
                            aria-label="Increase quantity"
                            size="2xs"
                            onClick={() => setNewItemQuantity((q) => q + 1)}
                        >
                            <IconChevronUp />
                        </IconButton>
                        <Text>{newItemQuantity}</Text>
                        <IconButton
                            aria-label="Decrease quantity"
                            size="2xs"
                            onClick={() => setNewItemQuantity((q) => Math.max(1, q - 1))}
                        >
                            <IconChevronDown />
                        </IconButton>
                    </Flex>
                </Flex>
            </Box> */}
        </Container>
    );
};

import { Box, Input, IconButton, Flex, Text, Checkbox, Icon } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IconStar, IconStarFilled, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { ShoppingList, ShoppingListContextType } from "@komuna/types";
import { API } from "../../axios";
import { toaster } from "../../chakra/ui/toaster";

interface ShoppingListPageProps {
    contextType?: ShoppingListContextType;
    data: ShoppingList;
}

export const ShoppingListPage: React.FC<ShoppingListPageProps> = ({ contextType, data }) => {
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [isUrgent, setIsUrgent] = useState(false);
    const addBoxRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState(data?.items);

    const updateItem = async (itemId: string, itemData: any) => {
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

    const handleAddItem = async () => {
        if (newItemName.trim()) {
            try {
                const response = await API.post("/shopping-list/add-item", {
                    itemData: {
                        name: newItemName,
                        amount: newItemQuantity,
                        isUrgent,
                        isPurchased: false,
                        assignedTo: null,
                        image: null,
                    },
                    contextType,
                });
                setItems((prevItems) => response.data);
                // Reset after saving
                setNewItemName("");
                setNewItemQuantity(1);
                setIsUrgent(false);
            } catch (error) {
                toaster.error({
                    title: "Error",
                    description: "Failed to add item",
                });
            }
        }
    };

    // Click outside to "save"
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (addBoxRef.current && !addBoxRef.current.contains(event.target as Node)) {
                handleAddItem();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newItemName, newItemQuantity, isUrgent]);

    return (
        <div>
            {items?.map((item) => (
                <Box key={item.itemId} p="4" borderWidth="1px" borderRadius="lg" mb="4">
                    <Flex justify="space-between" align="center">
                        <Flex>
                            <Checkbox.Root
                                checked={item.isPurchased}
                                variant={"outline"}
                                onChange={() => {
                                    updateItem(item.itemId, { isPurchased: !item.isPurchased });
                                }}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label></Checkbox.Label>
                            </Checkbox.Root>
                            <Text fontWeight="bold">{item.name}</Text>
                        </Flex>
                        <Icon onClick={() => updateItem(item.itemId, { isUrgent: !item.isUrgent })}>
                            {item.isUrgent ? <IconStarFilled /> : <IconStar />}
                        </Icon>
                    </Flex>
                    {/* <p>Category: {item.category}</p> */}
                    <p>Amount: {item.amount}</p>
                    {/* <p>Assigned To: {item.assignedTo}</p> */}
                    {/* <p>Is Urgent: {item.isUrgent ? "Yes" : "No"}</p> */}
                    {/* <p>Creator ID: {item.creatorId}</p> */}
                    {/* <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px" }} />  */}
                </Box >
            ))}

            <Box p="4" borderWidth="1px" borderRadius="lg" mb="4" ref={addBoxRef}>
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
            </Box>
        </div >
    );
};

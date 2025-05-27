import { Button, CloseButton, Container, Drawer, Flex, IconButton, Input, Portal } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";
import { ShoppingListItemQuantity } from "./shoppingListItemQuantity";
import { ShoppingListItemIsUrgent } from "./shoppingListItemIsUrgent";

const ShoppingListItemDetailsDrawer = () => {

    const { newItem, setNewItem, handleAddItem } = useShoppingList();

    return (
        <Drawer.Root placement={"bottom"}>
            <Drawer.Trigger asChild>
                <IconButton
                    aria-label="Add Item"
                >
                    <IconPlus />
                </IconButton>
            </Drawer.Trigger>

            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content h={"2xs"} borderTopRadius={"2xl"}>
                        <Drawer.Header>
                            <Drawer.Title>
                                הוספת פריט
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>

                            <Input
                                placeholder="Item name"
                                value={newItem?.name || ""}
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
                                        amount={newItem?.amount}
                                    />
                                </Flex>

                                <Flex gap={2}>
                                    <ShoppingListItemIsUrgent handleChange={(isUrgent) => {
                                        setNewItem({ ...newItem, isUrgent });
                                    }}
                                        isUrgent={newItem?.isUrgent}
                                    />

                                </Flex>
                            </Flex>
                        </Drawer.Body>
                        <Drawer.Footer justifyContent="space-between">
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline">
                                    ביטול
                                </Button>
                            </Drawer.ActionTrigger>
                            <Drawer.ActionTrigger asChild>
                                <Button onClick={handleAddItem} disabled={!newItem?.name?.trim()}>
                                    שמירה
                                </Button>
                            </Drawer.ActionTrigger>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>

        </Drawer.Root>
    )
}

export default ShoppingListItemDetailsDrawer;
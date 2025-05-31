import { Box, Button, CloseButton, Drawer, HStack, Icon, Input, InputGroup, Portal, Text, VStack } from "@chakra-ui/react";
import { useShoppingList } from "../../context/auth/ShoppingListProvider"
import SelectionCard from "../selectionCard";
import { IconSearch, IconShoppingBag } from "@tabler/icons-react";
import { usePurchase } from "../../context/auth/PurchaseProvider";
import { useFilterList } from "../../hooks/useFilterList";
import { testInput } from "../../utils/testInput";
import SearchInput from "../searchInput";

const ShoppingListPurchaseDrawer = () => {
    const { items } = useShoppingList();
    const { purchaseItems, toggleItem } = usePurchase();

    const { filteredResults, handleChange } = useFilterList(items.filter(item => !item.isPurchased), (list, value) => list.filter(item => testInput(item.name, value)))

    return (
        <Drawer.Root placement={"bottom"} >
            <Drawer.Trigger asChild>
                <Button size="sm">
                    ביצוע רכישה
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content h={"2xl"}>
                        <Drawer.Header>
                            <Drawer.Title>בחרו את הפריטים שנרכשו</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <SearchInput
                                placeholder="חיפוש פריט"
                                handleChange={handleChange}
                            />
                            <VStack>
                                {filteredResults.map((item) => (
                                    <SelectionCard
                                        key={item.itemId}
                                        title={item.name}
                                        description={item.category}
                                        selected={purchaseItems.has(item)}
                                        fallbackIcon={<IconShoppingBag />}
                                        onClick={() => toggleItem(item)}
                                    />
                                ))}
                            </VStack>
                        </Drawer.Body>
                        <Drawer.Footer justifyContent="space-between">
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline">
                                    ביטול
                                </Button>
                            </Drawer.ActionTrigger>
                            {/* <Button onClick={() => { }}>
                                המשך
                            </Button> */}
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>

    )
}

export default ShoppingListPurchaseDrawer;
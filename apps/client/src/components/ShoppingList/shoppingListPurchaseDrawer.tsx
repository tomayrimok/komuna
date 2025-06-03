import { Button, CloseButton, Drawer, Portal, VStack } from "@chakra-ui/react";
import { IconShoppingBag } from "@tabler/icons-react";
import { usePurchase } from "../../context/auth/PurchaseProvider";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";
import { useFilterList } from "../../hooks/useFilterList";
import { testInput } from "../../utils/testInput";
import SearchInput from "../searchInput";
import SelectionCard from "../selectionCard";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import CreatePurchaseButton from "./createPurchaseButton";

const ShoppingListPurchaseDrawer = () => {
    const { items, purchaseItems } = useShoppingList();
    const { toggleItem } = usePurchase();
    const { t } = useTranslation();

    const { filteredResults, handleChange } = useFilterList(items.filter(item => !item.isPurchased), (list, value) => list.filter(item => testInput(item.name, value)))

    const navigate = useNavigate();

    const handleSave = () => {
        navigate({ to: "/roommate/payments/create-expense", search: { fromShoppingList: true } });
    }

    return (
        <Drawer.Root placement={"bottom"} >

            <CreatePurchaseButton />
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content h={"2xl"}>
                        <Drawer.Header>
                            <Drawer.Title>
                                {t("shopping.choose_purchased_items")}
                            </Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <SearchInput
                                placeholder={t("shopping.search_item")}
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
                                    {t("cancel")}
                                </Button>
                            </Drawer.ActionTrigger>
                            <Button onClick={handleSave}>
                                {t("continue")}
                            </Button>
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
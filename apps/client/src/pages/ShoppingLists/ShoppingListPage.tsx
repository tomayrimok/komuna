import {
    Box,
    Button,
    Card,
    Drawer,
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
import { ShoppingListContextType } from "@komuna/types";
import { useNavigate } from "@tanstack/react-router";
import ShoppingListPurchaseDrawer from "../../components/ShoppingList/shoppingListPurchaseDrawer";
import ShoppingListItemDetailsDrawer from "../../components/ShoppingList/shoppingListItemDetailsDrawer";
import { useTranslation } from "react-i18next";

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
        handleAddItem,
        openEditDrawer,
        isShoppingListLoading,
    } = useShoppingList();

    const { t } = useTranslation();

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
                <Text fontSize="xl" fontWeight="bold">{t('shopping.shopping_list')}</Text>
                <ShoppingListItemDetailsDrawer />
            </Flex>

            {/* 
            {contextType === ShoppingListContextType.APARTMENT && (
                <ShoppingListPurchaseDrawer />
            )} */}


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
                        <Text mb={3}>
                            {t('shopping.list_is_empty')}
                        </Text>
                    </Flex>
                )
                    : null
            }
        </Flex >
    );
};

export default ShoppingListPage;
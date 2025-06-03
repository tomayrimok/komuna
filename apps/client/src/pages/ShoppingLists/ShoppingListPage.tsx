import {
    Flex,
    Icon,
    Loader,
    Text
} from "@chakra-ui/react";
import { ShoppingListContextType } from "@komuna/types";
import { IconShoppingCart } from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingListItem } from "../../components/ShoppingList/shoppingListItem";
import ShoppingListItemDetailsDrawer from "../../components/ShoppingList/shoppingListItemDetailsDrawer";
import ShoppingListPurchaseDrawer from "../../components/ShoppingList/shoppingListPurchaseDrawer";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";

// const NEW_ITEM_DEFAULT = {
//     itemId: "",
//     name: "",
//     amount: 1,
//     isUrgent: false,
//     isPurchased: false,
//     createdAt: new Date(),
// };



const ShoppingListPage: React.FC = () => {

    const addFormRef = useRef<HTMLDivElement>(null);
    const {
        items,
        newItem,
        updateOrder,
        handleAddItem,
        openEditDrawer,
        isFetching,
        setPurchaseItems
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

    useEffect(() => {
        setPurchaseItems(new Set());
    }, []);


    return (
        <Flex p={8} flexDirection={"column"} py={4} h="100%" pb={14}>
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="xl" fontWeight="bold">{t('shopping.shopping_list')}</Text>
                <ShoppingListItemDetailsDrawer />
            </Flex>


            {/* {contextType === ShoppingListContextType.APARTMENT && ( */}
            <ShoppingListPurchaseDrawer />
            {/* )} */}


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


            {isFetching ?
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
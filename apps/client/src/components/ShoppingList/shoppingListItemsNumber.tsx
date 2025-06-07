import { ContextType } from "@komuna/types";
import { useShoppingListQuery } from "../../hooks/query/useShoppingListQuery";
import { SkeletonText, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const ShoppingListItemsNumber = () => {

    const { data: shoppingList, isPending } = useShoppingListQuery(ContextType.APARTMENT);
    const { t } = useTranslation();
    const numUnpurchasedItems = shoppingList?.items?.filter(item => !item.isPurchased).length || 0;

    return (

        <Text fontWeight={'bold'} fontSize="xl">
            {isPending ? (
                <SkeletonText noOfLines={1} width="50%" m="auto" />
            ) : (
                t('shopping.num_unpurchased_items', { count: numUnpurchasedItems || 0 }) || ''
            )}
        </Text>
    );
}
import { ApiTypes, ShoppingListTemplateItemDto } from '@komuna/types';
import React, { PropsWithChildren } from 'react';
import { useGeneralShoppingListById, useUpdateGeneralShoppingList } from '../../hooks/query/useGeneralShoppingLists';
import {
    createShoppingListProvider,
    GenericShoppingListItem
} from './GenericShoppingListProvider';
import { ShoppingListContext } from './ShoppingListProvider';

type TemplateItem = ShoppingListTemplateItemDto & GenericShoppingListItem;

const GenericProvider = createShoppingListProvider(ShoppingListContext);

type GeneralShoppingListProviderProps = PropsWithChildren & {
    generalShoppingListId: string;
};

export const GeneralShoppingListProvider: React.ComponentType<GeneralShoppingListProviderProps> = ({
    children,
    generalShoppingListId
}) => {
    const { data: generalList, isLoading } = useGeneralShoppingListById(generalShoppingListId);
    const updateMutation = useUpdateGeneralShoppingList();

    const config = {
        title: generalList?.title || '',
        items: generalList?.items || [],
        isLoading,
        enablePurchaseFeatures: false,
        enableContextType: false,

        transformGroceryToItem: (grocery: ApiTypes.GroceryItem): TemplateItem => ({
            name: grocery.description,
            amount: 1,
            isUrgent: false,
            image: grocery.image,
            category: grocery.category,
        }),

        getItemKey: (item: TemplateItem, index: number): string => index.toString(),

        syncItems: async (items: TemplateItem[]) => {
            const data = await updateMutation.mutateAsync({
                generalShoppingListId,
                items,
            });
            return data?.items || [];
        },
    };

    return (
        <GenericProvider config={config}>
            {children}
        </GenericProvider>
    );
};

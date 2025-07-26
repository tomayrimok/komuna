import { ApiTypes, ShoppingListTemplateItemDto } from '@komuna/types';
import React, { PropsWithChildren } from 'react';
import { useGeneralShoppingListById, useUpdateGeneralShoppingList } from '../../hooks/query/useGeneralShoppingLists';
import {
    createShoppingListContext,
    createShoppingListProvider,
    createUseShoppingListHook,
    GenericShoppingListItem
} from './GenericShoppingListProvider';

type TemplateItem = ShoppingListTemplateItemDto & GenericShoppingListItem;

const GeneralShoppingListContext = createShoppingListContext<TemplateItem>();
const GenericProvider = createShoppingListProvider(GeneralShoppingListContext);

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
            await updateMutation.mutateAsync({
                generalShoppingListId,
                items,
            });
        },
    };

    return (
        <GenericProvider config={config}>
            {children}
        </GenericProvider>
    );
};

export const useGeneralShoppingList = createUseShoppingListHook(GeneralShoppingListContext); 
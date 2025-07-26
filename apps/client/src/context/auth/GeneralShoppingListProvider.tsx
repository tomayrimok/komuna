import { ApiTypes, ShoppingListTemplateItemDto } from '@komuna/types';
import React, { PropsWithChildren } from 'react';
import { useGeneralShoppingListById, useUpdateGeneralShoppingList } from '../../hooks/query/useGeneralShoppingLists';
import {
    createShoppingListContext,
    createShoppingListProvider,
    createUseShoppingListHook,
    GenericShoppingListContextValue,
    GenericShoppingListItem
} from './GenericShoppingListProvider';

// Template item type for general shopping lists
type TemplateItem = ShoppingListTemplateItemDto & GenericShoppingListItem;

// Create context and provider for general shopping lists
const GeneralShoppingListContext = createShoppingListContext<TemplateItem>();
const GenericProvider = createShoppingListProvider(GeneralShoppingListContext);

// Context value interface for general shopping lists
export interface GeneralShoppingListContextValue extends GenericShoppingListContextValue<TemplateItem> {
    // All methods are inherited from the generic context value
}

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
        enablePurchaseFeatures: false, // Templates don't have purchase functionality
        enableContextType: false, // Templates don't need context type switching

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
            return Promise.resolve();
        },
    };

    return (
        <GenericProvider config={config}>
            {children}
        </GenericProvider>
    );
};

export const useGeneralShoppingList = createUseShoppingListHook(GeneralShoppingListContext); 
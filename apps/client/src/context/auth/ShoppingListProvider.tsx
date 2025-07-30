import { API, ApiTypes, ContextType } from '@komuna/types';
import React, { PropsWithChildren, useState, useCallback } from 'react';
import { useShoppingListQuery } from '../../hooks/query/useShoppingListQuery';
import { useAuth } from './AuthProvider';
import {
  createShoppingListContext,
  createShoppingListProvider,
  createUseShoppingListHook,
  GenericShoppingListItem
} from './GenericShoppingListProvider';

type ShoppingListItemWithIdDto = ApiTypes.ShoppingListItemWithIdDto & GenericShoppingListItem;

export const ShoppingListContext = createShoppingListContext<ShoppingListItemWithIdDto>();
const GenericProvider = createShoppingListProvider(ShoppingListContext);

type ShoppingListProviderProps = PropsWithChildren & {};

export const ShoppingListProvider: React.ComponentType<ShoppingListProviderProps> = ({ children }) => {
  const [contextType, setContextType] = useState<ContextType>(ContextType.APARTMENT);
  const { data: shoppingList, isPending } = useShoppingListQuery(contextType);
  const { sessionDetails: { apartmentId } } = useAuth();

  const handleContextTypeChange = useCallback((newContextType: ContextType) => {
    setContextType(newContextType);
  }, []);

  const config = {
    title: '',
    items: shoppingList?.items || [],
    isLoading: isPending,
    enablePurchaseFeatures: true,
    enableContextType: true,
    initialContextType: contextType,
    onContextTypeChange: handleContextTypeChange,

    transformGroceryToItem: (grocery: ApiTypes.GroceryItem): ShoppingListItemWithIdDto => ({
      itemId: '',
      name: grocery.description,
      amount: 1,
      isUrgent: false,
      image: grocery.image,
      category: grocery.category,
      isPurchased: false,
      createdAt: new Date().toISOString(),
      creatorId: '',
    }),

    getItemKey: (item: ShoppingListItemWithIdDto, index: number): string => item.itemId,

    syncItems: async (items: ShoppingListItemWithIdDto[], currentContextType?: ContextType) => {

      const { data } = await API.shoppingListControllerSyncItems({
        body: {
          contextType: currentContextType || contextType,
          items,
          apartmentId: apartmentId!,
        },
        throwOnError: true,
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

export const useShoppingList = createUseShoppingListHook(ShoppingListContext);

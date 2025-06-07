import { API, ApiTypes, ContextType } from '@komuna/types';
import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { useShoppingListQuery } from '../../hooks/query/useShoppingListQuery';
import { toaster } from '../../chakra/ui/toaster';
import { useAuth } from './AuthProvider';

type ShoppingListItemWithIdDto = ApiTypes.ShoppingListItemWithIdDto;

export interface ShoppingListContextValue {
  // shoppingList?: ShoppingList;
  items: ShoppingListItemWithIdDto[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingListItemWithIdDto[]>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawerOpen: boolean;
  isEditDrawerOpen: boolean;
  isFetching: boolean;
  activeSwipe: string | null;
  purchaseItems: ShoppingListItemWithIdDto[];
  contextType: ContextType;
  handleAddItem: (newItem: ShoppingListItemWithIdDto) => Promise<void>;
  handleEditItem: (editingItem: ShoppingListItemWithIdDto) => void;
  handleDeleteItem: (itemId: string) => Promise<void>;
  openEditDrawer: (item: ShoppingListItemWithIdDto) => void;
  setEditDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveSwipe: React.Dispatch<React.SetStateAction<string | null>>;
  updateItem: (itemId: string, itemData: Partial<ShoppingListItemWithIdDto>, sync?: boolean) => Promise<void>;
  updateOrder: (items: ShoppingListItemWithIdDto[]) => Promise<void>;
  togglePurchased: (itemId: string) => Promise<void>;
  setPurchaseItems: React.Dispatch<React.SetStateAction<ShoppingListItemWithIdDto[]>>;
  setContextType: React.Dispatch<React.SetStateAction<ContextType>>;
  markAllPurchaseItemsAsPurchased: () => Promise<void>;
  syncShoppingList: (items?: ShoppingListItemWithIdDto[]) => Promise<void>;
}

export const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

type ShoppingListProviderProps = PropsWithChildren & {};

export const ShoppingListProvider: React.ComponentType<ShoppingListProviderProps> = ({ children }) => {
  const [contextType, setContextType] = useState<ContextType>(ContextType.APARTMENT);
  const { refetch: getShoppingList, data: shoppingList, isPending } = useShoppingListQuery(contextType);

  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState(shoppingList?.items || []);
  const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<ShoppingListItemWithIdDto[]>([]);

  useEffect(() => {
    setItems(shoppingList?.items || []);
  }, [shoppingList]);

  const updateItem = async (itemId: string, itemData: Partial<ShoppingListItemWithIdDto>, sync = true) => {
    const updatedItems = items.map((item) => (item.itemId === itemId ? { ...item, ...itemData } : item));
    setItems(updatedItems);
    if (sync) syncShoppingList(updatedItems);
  };

  const handleAddItem = async (newItem: ShoppingListItemWithIdDto) => {
    try {
      if (!newItem?.name?.trim()) throw new Error('Item name is required');
      const updatedItems = [newItem as ShoppingListItemWithIdDto, ...items];
      setItems(updatedItems);
      await syncShoppingList(updatedItems);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to add item',
      });
      throw error;
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const updatedItems = items.filter((item) => item.itemId !== itemId);
      setItems(updatedItems);
      await syncShoppingList(updatedItems);
      setActiveSwipe(null);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to delete item',
      });
    }
  };

  const handleEditItem = (editingItem: ApiTypes.ShoppingListItemWithIdDto) => {
    try {
      if (editingItem) {
        updateItem(editingItem.itemId, {
          name: editingItem.name,
          amount: editingItem.amount,
          isUrgent: editingItem.isUrgent,
        });
        setDrawerOpen(false);
      }
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to edit item',
      });
      throw error;
    }
  };

  const openEditDrawer = (item: ShoppingListItemWithIdDto) => {
    setDrawerOpen(true);
  };

  const updateOrder = async (orderedItems?: ShoppingListItemWithIdDto[]) => {
    const finalItems = orderedItems || items;
    setItems(finalItems);
    await syncShoppingList(finalItems);
  };

  const togglePurchased = async (itemId: string) => {
    const item = items.find((item) => item.itemId === itemId);
    if (!item) return;

    const updatedIsPurchased = !item.isPurchased;

    const updatedItems = items
      .map((i) => (i.itemId === itemId ? { ...i, isPurchased: updatedIsPurchased } : i))
      .sort((a, b) => {
        if (a.isPurchased && !b.isPurchased) return 1;
        if (!a.isPurchased && b.isPurchased) return -1;
        return 0;
      });

    setItems(updatedItems);
    await syncShoppingList(updatedItems);
    if (updatedIsPurchased) {
      setPurchaseItems((prev) => prev.filter((p) => p.itemId !== itemId));
    }
  };

  const syncShoppingList = async (itemsToSync?: ShoppingListItemWithIdDto[]) => {
    try {
      const { data } = await API.shoppingListControllerSyncItems({
        body: {
          contextType,
          items: itemsToSync || items,
          apartmentId: apartmentId!,
        },
        throwOnError: true,
      });
      setItems(data.items);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to sync shopping list',
      });
      getShoppingList();
    }
  };

  const markAllPurchaseItemsAsPurchased = async () => {
    const updatedItems = items
      .map((item) => {
        if (purchaseItems.some((p) => p.itemId === item.itemId)) {
          return { ...item, isPurchased: true };
        }
        return item;
      })
      .sort((a, b) => {
        if (a.isPurchased && !b.isPurchased) return 1;
        if (!a.isPurchased && b.isPurchased) return -1;
        return 0;
      });
    setItems(updatedItems);
    await syncShoppingList(updatedItems);
    setPurchaseItems([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        // shoppingList,
        items,
        setItems,
        setDrawerOpen,
        isDrawerOpen,
        handleEditItem,
        handleDeleteItem,
        openEditDrawer,
        setEditDrawerOpen,
        isEditDrawerOpen,
        setActiveSwipe,
        updateItem,
        isFetching: isPending,
        activeSwipe,
        updateOrder,
        togglePurchased,
        handleAddItem,
        contextType,
        syncShoppingList,
        setPurchaseItems,
        purchaseItems,
        setContextType,
        markAllPurchaseItemsAsPurchased,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('`useShoppingList` must be used within an `ShoppingListProvider`');
  }
  return context;
};

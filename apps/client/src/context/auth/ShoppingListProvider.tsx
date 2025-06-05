import { API, ShoppingListContextType } from '@komuna/types';
import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { useShoppingListQuery } from '../../hooks/query/useShoppingListQuery';
import { toaster } from '../../chakra/ui/toaster';
import { ApiTypes } from '@komuna/types';

type ShoppingListItemDto = ApiTypes.ShoppingListItemDto;
type NewShoppingListItemDto = ApiTypes.NewShoppingListItemDto;

export interface ShoppingListContextValue {
  // shoppingList?: ShoppingList;
  items: ShoppingListItemDto[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingListItemDto[]>>;
  editingItem: ShoppingListItemDto | null;
  setEditingItem: React.Dispatch<React.SetStateAction<ShoppingListItemDto | null>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawerOpen: boolean;
  handleAddItem: (newItem: ApiTypes.NewShoppingListItemDto) => Promise<void>;
  handleEditItem: () => void;
  handleDeleteItem: (itemId: string) => Promise<void>;
  openEditDrawer: (item: ShoppingListItemDto) => void;
  setEditDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDrawerOpen: boolean;
  setActiveSwipe: React.Dispatch<React.SetStateAction<string | null>>;
  updateItem: (itemId: string, itemData: Partial<ShoppingListItemDto>) => Promise<void>;
  isShoppingListLoading: boolean;
  handleAmountChange: (itemId: string, amount: number) => void;
  activeSwipe: string | null;
  updateOrder: (items: ShoppingListItemDto[]) => Promise<void>;
  togglePurchased: (itemId: string) => Promise<void>;
  contextType: ShoppingListContextType;
}

export const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

type ShoppingListProviderProps = PropsWithChildren & {
  contextType: ShoppingListContextType;
};

export const ShoppingListProvider: React.ComponentType<ShoppingListProviderProps> = ({ children, contextType }) => {
  const { shoppingList, isShoppingListLoading } = useShoppingListQuery(contextType);

  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState(shoppingList?.items || []);
  const [editingItem, setEditingItem] = useState<ShoppingListItemDto | null>(null);
  const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<ShoppingListItemDto[]>([]);

  useEffect(() => {
    if (shoppingList) {
      setItems(shoppingList.items);
    }
  }, [shoppingList]);

  const updateItem = async (itemId: string, itemData: Partial<ShoppingListItemDto>) => {
    setItems((prevItems) => prevItems.map((item) => (item.itemId === itemId ? { ...item, ...itemData } : item)));
    try {
      await API.shoppingListControllerUpdateItem({
        body: { itemId, itemData: itemData as ShoppingListItemDto, contextType },
      });
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to update item',
      });
    }
  };

  const handleAddItem = async (newItem: NewShoppingListItemDto) => {
    if (!newItem?.name?.trim()) throw new Error('Item name is required');
    try {
      const { data } = await API.shoppingListControllerAddItem({
        body: { itemData: newItem as NewShoppingListItemDto, contextType },
      });
      if (!data) throw new Error('Failed to add item');
      setItems(data.items);
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
      await API.shoppingListControllerDeleteItem({ body: { itemId, contextType } });
      setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
      setActiveSwipe(null);
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: 'Failed to delete item',
      });
    }
  };

  const handleEditItem = () => {
    if (editingItem) {
      updateItem(editingItem.itemId, {
        name: editingItem.name,
        amount: editingItem.amount,
        isUrgent: editingItem.isUrgent,
      });
      setEditingItem(null);
      setDrawerOpen(false);
    }
  };

  const openEditDrawer = (item: ShoppingListItemDto) => {
    setEditingItem({ ...item });
    setDrawerOpen(true);
  };

  const handleAmountChange = (itemId: string, amount: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.itemId === itemId ? { ...item, amount } : item)));
    updateItem(itemId, { amount });
  };

  const updateOrder = async (orderedItems?: ShoppingListItemDto[]) => {
    if (orderedItems) setItems(orderedItems);
    await API.shoppingListControllerChangeOrder({
      body: { contextType, itemIds: (orderedItems || items).map((item) => item.itemId) },
    });
  };

  const togglePurchased = async (itemId: string) => {
    const item = items.find((item) => item.itemId === itemId);
    if (!item) return;

    const updatedIsPurchased = !item.isPurchased;

    await updateItem(itemId, { isPurchased: updatedIsPurchased });
    setItems((prevItems) =>
      [...prevItems].sort((a, b) => {
        if (a.isPurchased && !b.isPurchased) return 1;
        if (!a.isPurchased && b.isPurchased) return -1;
        return 0;
      })
    );
    setTimeout(() => {
      updateOrder();
    }, 0);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        // shoppingList,
        items,
        setItems,
        editingItem,
        setEditingItem,
        setDrawerOpen,
        isDrawerOpen,
        handleAddItem,
        handleEditItem,
        handleDeleteItem,
        openEditDrawer,
        setEditDrawerOpen,
        isEditDrawerOpen,
        setActiveSwipe,
        updateItem,
        isShoppingListLoading,
        handleAmountChange,
        activeSwipe,
        updateOrder,
        togglePurchased,
        contextType,
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

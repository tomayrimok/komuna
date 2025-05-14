import { ShoppingList, ShoppingListContextType, ShoppingListItemDto } from '@komuna/types';
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { useShoppingListQuery } from '../../hooks/query/useShoppingListQuery';
import { toaster } from '../../chakra/ui/toaster';
import { API } from '../../axios';


export interface ShoppingListContextValue {
    shoppingList?: ShoppingList;
    items: ShoppingListItemDto[];
    newItem?: Partial<ShoppingListItemDto> | null;
    setItems: React.Dispatch<React.SetStateAction<ShoppingListItemDto[]>>;
    setNewItem: React.Dispatch<React.SetStateAction<Partial<ShoppingListItemDto> | null>>;
    editingItem: ShoppingListItemDto | null;
    setEditingItem: React.Dispatch<React.SetStateAction<ShoppingListItemDto | null>>;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
    handleAddItem: () => Promise<void>;
    handleEditItem: () => void;
    handleDeleteItem: (itemId: string) => Promise<void>;
    openEditDrawer: (item: ShoppingListItemDto) => void;
    setEditDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditDrawerOpen: boolean;
    setActiveSwipe: React.Dispatch<React.SetStateAction<string | null>>;
    updateItem: (itemId: string, itemData: Partial<ShoppingListItemDto>) => Promise<void>;
    isShoppingListLoading: boolean;
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
    const [newItem, setNewItem] = useState<Partial<ShoppingListItemDto> | null>(null);
    const [activeSwipe, setActiveSwipe] = useState<string | null>(null);

    useEffect(() => {
        if (shoppingList) {
            setItems(shoppingList.items);
        }
    }, [shoppingList]);


    const updateItem = async (itemId: string, itemData: Partial<ShoppingListItemDto>) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.itemId === itemId ? { ...item, ...itemData } : item))
        );
        try {
            await API.post("/shopping-list/update-item", {
                itemId,
                itemData,
                contextType,
            });
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to update item",
            });
        }
    };

    const handleAddItem = async () => {
        if (newItem?.name?.trim()) {
            try {
                const response = await API.post("/shopping-list/add-item", {
                    itemData: newItem,
                    contextType,
                });
                setItems(response.data);
                setNewItem(null);
            } catch (error) {
                toaster.error({
                    title: "Error",
                    description: "Failed to add item",
                });
            }
        } else {
            setNewItem(null);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await API.post("/shopping-list/delete-item", { itemId, contextType });
            setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
            setActiveSwipe(null);
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to delete item",
            });
        }
    };

    const handleEditItem = () => {
        if (editingItem) {
            updateItem(editingItem.itemId, {
                name: editingItem.name,
                amount: editingItem.amount,
                isUrgent: editingItem.isUrgent
            });
            setEditingItem(null);
            setDrawerOpen(false);
        }
    };

    const openEditDrawer = (item: ShoppingListItemDto) => {
        setEditingItem({ ...item });
        setDrawerOpen(true)
    };

    return (
        <ShoppingListContext.Provider
            value={{
                shoppingList,
                items,
                setItems,
                setNewItem,
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
                newItem,
                isShoppingListLoading
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

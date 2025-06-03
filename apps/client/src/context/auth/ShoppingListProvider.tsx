import { API, ShoppingListContextType } from '@komuna/types';
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { useShoppingListQuery } from '../../hooks/query/useShoppingListQuery';
import { toaster } from '../../chakra/ui/toaster';
import { useAuth } from './AuthProvider';
import { ShoppingListItemWithIdDto } from 'libs/types/src/generated';


export interface ShoppingListContextValue {
    items: ShoppingListItemWithIdDto[];
    newItem?: Partial<ShoppingListItemWithIdDto> | null;
    editingItem: ShoppingListItemWithIdDto | null;
    isDrawerOpen: boolean;
    isEditDrawerOpen: boolean;
    isFetching: boolean;
    activeSwipe: string | null;
    contextType: ShoppingListContextType;
    purchaseItems: Set<ShoppingListItemWithIdDto>;
    setItems: React.Dispatch<React.SetStateAction<ShoppingListItemWithIdDto[]>>;
    setNewItem: React.Dispatch<React.SetStateAction<Partial<ShoppingListItemWithIdDto> | null>>;
    setEditingItem: React.Dispatch<React.SetStateAction<ShoppingListItemWithIdDto | null>>;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddItem: () => Promise<void>;
    handleEditItem: () => void;
    handleDeleteItem: (itemId: string) => Promise<void>;
    openEditDrawer: (item: ShoppingListItemWithIdDto) => void;
    setEditDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveSwipe: React.Dispatch<React.SetStateAction<string | null>>;
    updateItem: (itemId: string, itemData: Partial<ShoppingListItemWithIdDto>, sync?: boolean) => Promise<void>;
    syncShoppingList: (items?: ShoppingListItemWithIdDto[]) => Promise<void>;
    updateOrder: (items: ShoppingListItemWithIdDto[]) => Promise<void>;
    togglePurchased: (itemId: string) => Promise<void>;
    setPurchaseItems: React.Dispatch<React.SetStateAction<Set<ShoppingListItemWithIdDto>>>;
    setContextType: React.Dispatch<React.SetStateAction<ShoppingListContextType>>;
    markAllPurchaseItemsAsPurchased: () => Promise<void>;
}

export const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

type ShoppingListProviderProps = PropsWithChildren;
export const ShoppingListProvider: React.ComponentType<ShoppingListProviderProps> = ({ children }) => {

    const [contextType, setContextType] = useState<ShoppingListContextType>(ShoppingListContextType.APARTMENT);

    const { mutate: getShoppingList, data: shoppingList, isPending } = useShoppingListQuery();

    const { sessionDetails: { apartmentId } } = useAuth();

    const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [items, setItems] = useState(shoppingList?.items || []);
    const [editingItem, setEditingItem] = useState<ShoppingListItemWithIdDto | null>(null);
    const [newItem, setNewItem] = useState<Partial<ShoppingListItemWithIdDto> | null>(null);
    const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
    const [purchaseItems, setPurchaseItems] = useState<Set<ShoppingListItemWithIdDto>>(new Set());


    useEffect(() => {
        setItems(shoppingList?.items || []);
    }, [shoppingList]);

    useEffect(() => {
        getShoppingList(contextType);
    }, [contextType, apartmentId]);


    const updateItem = async (itemId: string, itemData: Partial<ShoppingListItemWithIdDto>, sync = true) => {
        const updatedItems = items.map(item =>
            item.itemId === itemId ? { ...item, ...itemData } : item
        );
        setItems(updatedItems);
        if (sync) syncShoppingList(updatedItems);
    };

    const handleAddItem = async () => {
        if (newItem?.name?.trim()) {
            const updatedItems = [...items, newItem as ShoppingListItemWithIdDto];
            setItems(updatedItems);
            await syncShoppingList(updatedItems);
            setNewItem(null);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            const updatedItems = items.filter(item => item.itemId !== itemId);
            setItems(updatedItems);
            await syncShoppingList(updatedItems);
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

    const openEditDrawer = (item: ShoppingListItemWithIdDto) => {
        setEditingItem({ ...item });
        setDrawerOpen(true)
    };

    const updateOrder = async (orderedItems?: ShoppingListItemWithIdDto[]) => {
        const finalItems = orderedItems || items;
        setItems(finalItems);
        await syncShoppingList(finalItems);
    };

    const togglePurchased = async (itemId: string) => {
        const item = items.find(item => item.itemId === itemId);
        if (!item) return;

        const updatedIsPurchased = !item.isPurchased;

        const updatedItems = items.map(i =>
            i.itemId === itemId ? { ...i, isPurchased: updatedIsPurchased } : i
        ).sort((a, b) => {
            if (a.isPurchased && !b.isPurchased) return 1;
            if (!a.isPurchased && b.isPurchased) return -1;
            return 0;
        });

        setItems(updatedItems);
        await syncShoppingList(updatedItems);
    };

    const syncShoppingList = async (itemsToSync?: ShoppingListItemWithIdDto[]) => {
        try {
            const { data } = await API.shoppingListControllerSyncItems({
                body: {
                    contextType,
                    items: itemsToSync || items,
                    apartmentId: apartmentId!
                },
                throwOnError: true
            })
            setItems(data.items);
        }
        catch (error) {
            toaster.error({
                title: "Error",
                description: "Failed to sync shopping list",
            });
            getShoppingList(contextType);
        }
    }

    const markAllPurchaseItemsAsPurchased = async () => {
        const updatedItems = items.map(item => {
            if (purchaseItems.has(item)) {
                return { ...item, isPurchased: true };
            }
            return item;
        }).sort((a, b) => {
            if (a.isPurchased && !b.isPurchased) return 1;
            if (!a.isPurchased && b.isPurchased) return -1;
            return 0;
        });;
        setItems(updatedItems)
        await syncShoppingList(updatedItems);
        setPurchaseItems(new Set());
    }

    return (
        <ShoppingListContext.Provider
            value={{
                // shoppingList,
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
                isFetching: isPending,
                activeSwipe,
                updateOrder,
                togglePurchased,
                contextType,
                syncShoppingList,
                setPurchaseItems,
                purchaseItems,
                setContextType,
                markAllPurchaseItemsAsPurchased
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


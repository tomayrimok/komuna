import { ApiTypes, ContextType } from '@komuna/types';
import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { toaster } from '../../chakra/ui/toaster';

// Generic item type that works for both shopping list items and template items
export type GenericShoppingListItem = {
    name: string;
    amount: number;
    isUrgent?: boolean;
    category?: string;
    image?: string;
} & (
        | { itemId: string; isPurchased?: boolean; createdAt?: string; creatorId?: string } // Regular shopping list item
        | { index?: number } // Template item (uses array index)
    );

export interface GenericShoppingListConfig<TItem extends GenericShoppingListItem> {
    // Data and sync functions
    items: TItem[];
    isLoading: boolean;
    syncItems: (items: TItem[], contextType?: ContextType) => Promise<TItem[]>;

    // Feature flags
    enablePurchaseFeatures?: boolean;
    enableContextType?: boolean;

    // Context type handling
    initialContextType?: ContextType;
    onContextTypeChange?: (contextType: ContextType) => void;

    // Item transformation functions
    transformGroceryToItem: (grocery: ApiTypes.GroceryItem) => TItem;
    getItemKey: (item: TItem, index: number) => string;
}

export interface GenericShoppingListContextValue<TItem extends GenericShoppingListItem> {
    items: TItem[];
    setItems: React.Dispatch<React.SetStateAction<TItem[]>>;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
    isEditDrawerOpen: boolean;
    isFetching: boolean;
    activeSwipe: string | null;
    contextType?: ContextType;

    // Core item operations
    handleAddItem: (newItem: TItem) => Promise<void>;
    handleEditItem: (editingItem: TItem) => void;
    handleDeleteItem: (identifier: string | number) => Promise<void>;
    openEditDrawer: (item: TItem) => void;
    setEditDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveSwipe: React.Dispatch<React.SetStateAction<string | null>>;
    updateItem: (identifier: string | number, itemData: Partial<TItem>, sync?: boolean) => Promise<void>;
    updateOrder: (items: TItem[]) => Promise<void>;
    syncShoppingList: (items?: TItem[]) => Promise<void>;

    // Purchase features (only available when enabled)
    purchaseItems?: TItem[];
    togglePurchased?: (identifier: string | number) => Promise<void>;
    setPurchaseItems?: React.Dispatch<React.SetStateAction<TItem[]>>;
    setContextType?: React.Dispatch<React.SetStateAction<ContextType>>;
    markAllPurchaseItemsAsPurchased?: () => Promise<void>;
}

export function createShoppingListContext<TItem extends GenericShoppingListItem>() {
    return createContext<GenericShoppingListContextValue<TItem> | null>(null);
}

export function createShoppingListProvider<TItem extends GenericShoppingListItem>(
    Context: React.Context<GenericShoppingListContextValue<TItem> | null>
) {
    return function Provider({ children, config }: PropsWithChildren & { config: GenericShoppingListConfig<TItem> }) {
        const [contextType, setContextType] = useState<ContextType>(
            config.initialContextType || ContextType.APARTMENT
        );
        const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
        const [isDrawerOpen, setDrawerOpen] = useState(false);
        const [items, setItems] = useState<TItem[]>(config.items || []);
        const [activeSwipe, setActiveSwipe] = useState<string | null>(null);
        const [purchaseItems, setPurchaseItems] = useState<TItem[]>([]);

        useEffect(() => {
            setItems(config.items || []);
        }, [config.items]);

        // Handle contextType changes
        useEffect(() => {
            if (config.onContextTypeChange && config.enableContextType) {
                config.onContextTypeChange(contextType);
            }
        }, [contextType, config]);

        const updateItem = async (identifier: string | number, itemData: Partial<TItem>, sync = true) => {
            const updatedItems = items.map((item, index) => {
                const isMatch = typeof identifier === 'string'
                    ? ('itemId' in item && item.itemId === identifier)
                    : index === identifier;

                return isMatch ? { ...item, ...itemData } : item;
            });
            setItems(updatedItems);
            if (sync) await syncShoppingList(updatedItems);
        };

        const handleAddItem = async (newItem: TItem) => {
            try {
                if (!newItem?.name?.trim()) throw new Error('Item name is required');
                const updatedItems = [newItem, ...items];
                setItems(updatedItems);
                await syncShoppingList(updatedItems);
            } catch (error) {
                toaster.create({
                    title: 'Error',
                    description: 'Failed to add item',
                    type: 'error',
                });
                throw error;
            }
        };

        const handleDeleteItem = async (identifier: string | number) => {
            try {
                const updatedItems = items.filter((item, index) => {
                    const isMatch = typeof identifier === 'string'
                        ? ('itemId' in item && item.itemId === identifier)
                        : index === identifier;
                    return !isMatch;
                });
                setItems(updatedItems);
                await syncShoppingList(updatedItems);
                setActiveSwipe(null);
            } catch (error) {
                toaster.create({
                    title: 'Error',
                    description: 'Failed to delete item',
                    type: 'error',
                });
            }
        };

        const handleEditItem = (editingItem: TItem) => {
            try {
                if (editingItem) {
                    const identifier = 'itemId' in editingItem ? editingItem.itemId : items.indexOf(editingItem);
                    updateItem(identifier, {
                        name: editingItem.name,
                        amount: editingItem.amount,
                        isUrgent: editingItem.isUrgent,
                    } as Partial<TItem>);
                    setDrawerOpen(false);
                }
            } catch (error) {
                toaster.create({
                    title: 'Error',
                    description: 'Failed to edit item',
                    type: 'error',
                });
                throw error;
            }
        };

        const openEditDrawer = (item: TItem) => {
            setDrawerOpen(true);
        };

        const updateOrder = async (orderedItems: TItem[]) => {
            setItems(orderedItems);
            await syncShoppingList(orderedItems);
        };

        const togglePurchased = async (identifier: string | number) => {
            if (!config.enablePurchaseFeatures) return;

            const itemIndex = typeof identifier === 'string'
                ? items.findIndex(item => 'itemId' in item && item.itemId === identifier)
                : identifier;

            const item = items[itemIndex];
            if (!item || !('isPurchased' in item)) return;

            const updatedIsPurchased = !item.isPurchased;

            const updatedItems = items
                .map((i, index) => index === itemIndex ? { ...i, isPurchased: updatedIsPurchased } as TItem : i)
                .sort((a, b) => {
                    const aIsPurchased = 'isPurchased' in a ? a.isPurchased : false;
                    const bIsPurchased = 'isPurchased' in b ? b.isPurchased : false;
                    if (aIsPurchased && !bIsPurchased) return 1;
                    if (!aIsPurchased && bIsPurchased) return -1;
                    return 0;
                });

            setItems(updatedItems);
            await syncShoppingList(updatedItems);

            if (updatedIsPurchased) {
                setPurchaseItems((prev) => prev.filter(p => {
                    const pIdentifier = 'itemId' in p ? p.itemId : prev.indexOf(p);
                    return pIdentifier !== identifier;
                }));
            }
        };

        const syncShoppingList = async (itemsToSync?: TItem[]) => {
            try {
                const newItems = await config.syncItems(itemsToSync || items, config.enableContextType ? contextType : undefined);
                setItems(newItems);
            } catch (error) {
                toaster.create({
                    title: 'Error',
                    description: 'Failed to sync shopping list',
                    type: 'error',
                });
            }
        };

        const markAllPurchaseItemsAsPurchased = async () => {
            if (!config.enablePurchaseFeatures) return;

            const updatedItems = items
                .map((item) => {
                    const shouldMark = purchaseItems.some(p => {
                        const pKey = config.getItemKey(p, items.indexOf(p));
                        const itemKey = config.getItemKey(item, items.indexOf(item));
                        return pKey === itemKey;
                    });

                    if (shouldMark && 'isPurchased' in item) {
                        return { ...item, isPurchased: true } as TItem;
                    }
                    return item;
                })
                .sort((a, b) => {
                    const aIsPurchased = 'isPurchased' in a ? a.isPurchased : false;
                    const bIsPurchased = 'isPurchased' in b ? b.isPurchased : false;
                    if (aIsPurchased && !bIsPurchased) return 1;
                    if (!aIsPurchased && bIsPurchased) return -1;
                    return 0;
                });

            setItems(updatedItems);
            await syncShoppingList(updatedItems);
            setPurchaseItems([]);
        };

        const contextValue: GenericShoppingListContextValue<TItem> = {
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
            isFetching: config.isLoading,
            activeSwipe,
            updateOrder,
            handleAddItem,
            syncShoppingList,
            ...(config.enableContextType && {
                contextType,
                setContextType,
            }),
            ...(config.enablePurchaseFeatures && {
                togglePurchased,
                setPurchaseItems,
                purchaseItems,
                markAllPurchaseItemsAsPurchased,
            }),
        };

        return (
            <Context.Provider value={contextValue}>
                {children}
            </Context.Provider>
        );
    };
}

export function createUseShoppingListHook<TItem extends GenericShoppingListItem>(
    context: React.Context<GenericShoppingListContextValue<TItem> | null>
) {
    return () => {
        const contextValue = useContext(context);
        if (!contextValue) {
            throw new Error('useShoppingList must be used within a ShoppingListProvider');
        }
        return contextValue;
    };
} 
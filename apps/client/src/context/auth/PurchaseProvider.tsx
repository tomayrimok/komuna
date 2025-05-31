import { ShoppingListItemDto } from 'libs/types/src/generated/types.gen';
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';


export interface PurchaseContextValue {
    purchaseItems: Set<ShoppingListItemDto>;
    setPurchaseItems: React.Dispatch<React.SetStateAction<Set<ShoppingListItemDto>>>;
    toggleItem: (item: ShoppingListItemDto) => void;
}

export const PurchaseContext = createContext<PurchaseContextValue | null>(null);

type PurchaseProviderProps = PropsWithChildren

export const PurchaseProvider: React.ComponentType<PurchaseProviderProps> = ({ children }) => {

    const [purchaseItems, setPurchaseItems] = useState<Set<ShoppingListItemDto>>(new Set());

    const toggleItem = (item: ShoppingListItemDto) => {
        setPurchaseItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) {
                newSet.delete(item);
            } else {
                newSet.add(item);
            }
            return newSet;
        });
    };

    return (
        <PurchaseContext.Provider
            value={{
                purchaseItems,
                setPurchaseItems,
                toggleItem
            }}
        >
            {children}
        </PurchaseContext.Provider>
    );
};

export const usePurchase = () => {
    const context = useContext(PurchaseContext);
    if (!context) {
        throw new Error('`usePurchase` must be used within an `PurchaseProvider`');
    }
    return context;
};

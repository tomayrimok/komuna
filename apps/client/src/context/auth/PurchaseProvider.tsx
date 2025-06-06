import { ShoppingListItemWithIdDto } from 'libs/types/src/generated/types.gen';
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect, useRef } from 'react';
import { useShoppingList } from './ShoppingListProvider';


export interface PurchaseContextValue {
    toggleItem: (item: ShoppingListItemWithIdDto) => void;
}

export const PurchaseContext = createContext<PurchaseContextValue | null>(null);

type PurchaseProviderProps = PropsWithChildren

export const PurchaseProvider: React.ComponentType<PurchaseProviderProps> = ({ children }) => {

    const { setPurchaseItems } = useShoppingList()

    const toggleItem = (item: ShoppingListItemWithIdDto) => {
        setPurchaseItems(prev => {
            const newItems = [...prev];
            const index = newItems.findIndex(i => i.itemId === item.itemId);
            if (index > -1) {
                newItems.splice(index, 1);
            }
            else {
                newItems.push(item);
            }
            return newItems;
        });
    };


    return (
        <PurchaseContext.Provider
            value={{
                toggleItem,
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

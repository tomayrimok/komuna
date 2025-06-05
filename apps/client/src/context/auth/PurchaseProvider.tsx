import { ShoppingListItemWithIdDto } from 'libs/types/src/generated/types.gen';
import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

export interface PurchaseContextValue {
  purchaseItems: Set<ShoppingListItemWithIdDto>;
  setPurchaseItems: React.Dispatch<React.SetStateAction<Set<ShoppingListItemWithIdDto>>>;
  toggleItem: (item: ShoppingListItemWithIdDto) => void;
}

export const PurchaseContext = createContext<PurchaseContextValue | null>(null);

type PurchaseProviderProps = PropsWithChildren;

export const PurchaseProvider: React.ComponentType<PurchaseProviderProps> = ({ children }) => {
  const [purchaseItems, setPurchaseItems] = useState<Set<ShoppingListItemWithIdDto>>(new Set());

  const toggleItem = (item: ShoppingListItemWithIdDto) => {
    setPurchaseItems((prev) => {
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

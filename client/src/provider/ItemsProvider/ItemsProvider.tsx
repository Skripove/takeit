import React, { createContext } from "react";
import { ItemID, ItemType } from "../../types/item";
import { useTakeItStorage } from "../../hooks/useTakeItStorage";

type ItemsCtx = {
  getAllItems: () => Promise<ItemType[]>;
  addItem: (text: string) => Promise<ItemType>;
  removeItem: (itemId: ItemID) => Promise<ItemID>;
};

const ItemsContext = createContext<ItemsCtx | undefined>(undefined);

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, addItem, removeItem } = useTakeItStorage();

  const value: ItemsCtx = {
    getAllItems,
    addItem,
    removeItem,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

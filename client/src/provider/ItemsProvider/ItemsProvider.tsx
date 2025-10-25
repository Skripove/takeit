import React, { createContext } from "react";
import { ItemID, ItemType } from "../../types/item";
import {
  StorageItemType,
  useTakeItStorage,
} from "../../hooks/useTakeItStorage";

type ItemsCtx = {
  getAllItems: () => Promise<ItemType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  addItem: (text: string) => Promise<ItemType>;
  removeItem: (itemId: ItemID) => Promise<ItemID>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  getAllItems: async () => [],
  seeAllItems: async () => [],
  addItem: async () => ({}) as ItemType,
  removeItem: async () => "",
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, seeAllItems, addItem, removeItem, clearItems } =
    useTakeItStorage();

  const value: ItemsCtx = {
    getAllItems,
    seeAllItems,
    addItem,
    removeItem,
    clearItems,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

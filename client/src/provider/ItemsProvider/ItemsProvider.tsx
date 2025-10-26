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
  removeItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  getAllItems: async () => [],
  seeAllItems: async () => [],
  addItem: async () => ({}) as ItemType,
  removeItem: async () => "",
  removeItems: async () => undefined,
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    getAllItems,
    seeAllItems,
    addItem,
    removeItem,
    removeItems,
    clearItems,
  } = useTakeItStorage();

  const value: ItemsCtx = {
    getAllItems,
    seeAllItems,
    addItem,
    removeItem,
    removeItems,
    clearItems,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

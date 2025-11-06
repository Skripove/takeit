import React, { createContext } from "react";
import { ItemID, ItemType } from "../types/item";
import { StorageItemType, useTakeItStorage } from "../hooks/useTakeItStorage";

type ItemsCtx = {
  getAllItems: () => Promise<ItemType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  addItem: (text: string) => Promise<ItemType>;
  removeItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  getAllItems: async () => [],
  seeAllItems: async () => [],
  addItem: async () => ({}) as ItemType,
  removeItems: async () => undefined,
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, seeAllItems, addItem, removeItems, clearItems } =
    useTakeItStorage();

  const value = React.useMemo<ItemsCtx>(
    () => ({
      getAllItems,
      seeAllItems,
      addItem,
      removeItems,
      clearItems,
    }),
    [getAllItems, seeAllItems, addItem, removeItems, clearItems]
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

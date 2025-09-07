import React, { createContext } from "react";
import { ItemID, ItemType } from "../../types/item";
import { useTakeItStorage } from "../../hooks/useTakeItStorage";

type ItemsCtx = {
  getItems: () => ItemType[];
  add: (text: string) => void;
  remove: (itemId: ItemID) => void;
};

const ItemsContext = createContext<ItemsCtx | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storage = useTakeItStorage();

  const getItems = () => storage.items;

  const add = (text: string) => {
    storage.addItem(text);
  };

  const remove = (itemId: ItemID) => {
    storage.removeItem(itemId);
  };

  const value: ItemsCtx = {
    getItems,
    add,
    remove,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

import React, { createContext, useCallback, useEffect, useState } from "react";
import { ItemID, ItemType } from "../types/item";
import { StorageItemType, useTakeItStorage } from "../hooks/useTakeItStorage";

type ItemsCtx = {
  items: ItemType[];
  getAllItems: () => Promise<ItemType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  addItem: (text: string) => Promise<ItemType>;
  deleteItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  items: [],
  getAllItems: async () => [],
  seeAllItems: async () => [],
  addItem: async () => ({}) as ItemType,
  deleteItems: async () => undefined,
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, seeAllItems, addItem, removeItems, clearItems } =
    useTakeItStorage();

  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Items - provider...");
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAllItems]);

  const addItemHandler = useCallback(async (title: string) => {
    const newItem = await addItem(title);
    setItems((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const deleteItemsHandler = useCallback(async (itemIds: ItemID[]) => {
    await removeItems(itemIds);
    setItems((prev) =>
      prev.filter((prevItem) => !itemIds.includes(prevItem.id))
    );
  }, []);

  const value = React.useMemo<ItemsCtx>(
    () => ({
      items,
      getAllItems,
      seeAllItems,
      addItem: addItemHandler,
      deleteItems: deleteItemsHandler,
      clearItems,
    }),
    [
      items,
      getAllItems,
      seeAllItems,
      addItemHandler,
      deleteItemsHandler,
      clearItems,
    ]
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

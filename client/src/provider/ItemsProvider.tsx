import React, { createContext, useCallback, useEffect, useState } from "react";
import { ItemID, ItemType } from "@/types/item";
import { useStorage } from "./StorageProvider";

type ItemsCtx = {
  items: ItemType[];
  getAllItems: () => Promise<ItemType[]>;
  getItems: (itemIds: ItemID[]) => Promise<ItemType[]>;
  addItems: (itemTitles: string[]) => Promise<void>;
  deleteItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  items: [],
  getAllItems: async () => [],
  getItems: async () => [],
  addItems: async () => undefined,
  deleteItems: async () => undefined,
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, addItems, removeItems, clearItems } = useStorage();

  const [items, setItems] = useState<ItemType[]>([]);

  const loadItems = useCallback(async () => {
    const allItems = await getAllItems();
    setItems(allItems);
  }, [getAllItems]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Items - provider...");
        await loadItems();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [loadItems]);

  const addItemsHandler = useCallback(
    async (itemTitles: string[]) => {
      await addItems(itemTitles);
      await loadItems();
    },
    [addItems, loadItems]
  );

  const getItemsByIds = useCallback(
    async (itemIds: ItemID[]) => {
      if (!itemIds.length) return [];
      const allItems = await getAllItems();
      const ids = new Set(itemIds);
      return allItems.filter((item) => ids.has(item.id));
    },
    [getAllItems]
  );

  const deleteItemsHandler = useCallback(
    async (itemIds: ItemID[]) => {
      await removeItems(itemIds);
      await loadItems();
    },
    [removeItems, loadItems]
  );

  const value = React.useMemo<ItemsCtx>(
    () => ({
      items,
      getAllItems,
      getItems: getItemsByIds,
      addItems: addItemsHandler,
      deleteItems: deleteItemsHandler,
      clearItems,
    }),
    [
      items,
      getAllItems,
      getItemsByIds,
      addItemsHandler,
      deleteItemsHandler,
      clearItems,
    ]
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

import React, { createContext, useCallback, useEffect, useState } from "react";
import { ItemID, ItemType } from "../types/item";
import { StorageItemType, useTakeItStorage } from "../hooks/useTakeItStorage";

type ItemsCtx = {
  items: ItemType[];
  getAllItems: () => Promise<ItemType[]>;
  getItems: (itemIds: ItemID[]) => Promise<StorageItemType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  addItems: (itemTitles: string[]) => Promise<void>;
  deleteItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  items: [],
  getAllItems: async () => [],
  getItems: async () => [],
  seeAllItems: async () => [],
  addItems: async () => undefined,
  deleteItems: async () => undefined,
  clearItems: async () => {},
});

export const ItemsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { getAllItems, seeAllItems, addItems, removeItems, clearItems } =
    useTakeItStorage();

  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Items - provider...");
        await loadItems();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const loadItems = async () => {
    const allItems = await getAllItems();
    setItems(allItems);
  };

  const addItemsHandler = useCallback(async (itemTitles: string[]) => {
    await addItems(itemTitles);
    await loadItems();
  }, []);

  const getItemsByIds = useCallback(
    async (itemIds: ItemID[]) => {
      if (!itemIds.length) return [];
      const allItems = await seeAllItems();
      const ids = new Set(itemIds);
      return allItems.filter((item) => ids.has(item.id));
    },
    [seeAllItems]
  );

  const deleteItemsHandler = useCallback(async (itemIds: ItemID[]) => {
    await removeItems(itemIds);
    await loadItems();
  }, []);

  const value = React.useMemo<ItemsCtx>(
    () => ({
      items,
      getAllItems,
      getItems: getItemsByIds,
      seeAllItems,
      addItems: addItemsHandler,
      deleteItems: deleteItemsHandler,
      clearItems,
    }),
    [
      items,
      getAllItems,
      getItemsByIds,
      seeAllItems,
      addItemsHandler,
      deleteItemsHandler,
      clearItems,
    ]
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

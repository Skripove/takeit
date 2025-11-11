import React, { createContext, useCallback, useEffect, useState } from "react";
import { ItemID, ItemType } from "../types/item";
import { StorageItemType, useTakeItStorage } from "../hooks/useTakeItStorage";

type ItemsCtx = {
  items: ItemType[];
  getAllItems: () => Promise<ItemType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  addItems: (itemTitles: string[]) => Promise<void>;
  deleteItems: (itemIds: ItemID[]) => Promise<void>;
  clearItems: () => Promise<void>;
};

export const ItemsContext = createContext<ItemsCtx>({
  items: [],
  getAllItems: async () => [],
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

  const deleteItemsHandler = useCallback(async (itemIds: ItemID[]) => {
    await removeItems(itemIds);
    await loadItems();
  }, []);

  const value = React.useMemo<ItemsCtx>(
    () => ({
      items,
      getAllItems,
      seeAllItems,
      addItems: addItemsHandler,
      deleteItems: deleteItemsHandler,
      clearItems,
    }),
    [
      items,
      getAllItems,
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

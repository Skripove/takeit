import { ItemID, ItemType } from "../types/item";
import { EventID, EventType } from "../types/event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useCallback } from "react";

export type StorageItemType = ItemType & {
  events: EventID[];
};

export type StorageEventType = EventType & {
  items: ItemID[];
};

type Storage = {
  getAllItems: () => Promise<ItemType[]>;
  getAllEvents: () => Promise<EventType[]>;
  seeAllItems: () => Promise<StorageItemType[]>;
  seeAllEvents: () => Promise<StorageEventType[]>;
  // Items
  addItem: (text: string) => Promise<ItemType>;
  removeItem: (itemId: ItemID) => Promise<ItemID>;
  removeItems: (itemIds: ItemID[]) => Promise<void>;
  // Events
  addEvent: (title: string) => Promise<EventType>;
  removeEvent: (eventId: EventID) => Promise<EventID>;
  // Привязка item к событию
  attachItems: (itemIds: ItemID[], eventIds: EventID[]) => Promise<void>;
  detachItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
  // Clear
  clearItems: () => Promise<void>;
  clearEvents: () => Promise<void>;
};

const ITEMS_STORAGE_KEY = "items_storage";
const EVENTS_STORAGE_KEY = "events_storage";

const now = () => new Date().toISOString();
const uid = () => Crypto.randomUUID();

export const useTakeItStorage = (): Storage => {
  const getAllItems = useCallback(async () => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const storageItems = JSON.parse(raw) as StorageItemType[];
    const items: ItemType[] = storageItems.map(({ events, ...rest }) => ({
      ...rest,
    }));
    return items;
  }, []);

  const getAllEvents = useCallback(async () => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const storageItems = JSON.parse(raw) as StorageEventType[];
    const events: EventType[] = storageItems.map(({ items, ...rest }) => rest);
    return events;
  }, []);

  const seeAllItems = useCallback(async () => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const storageItems = JSON.parse(raw) as StorageItemType[];
    return storageItems;
  }, []);

  const seeAllEvents = useCallback(async () => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const storageEvents = JSON.parse(raw) as StorageEventType[];
    return storageEvents;
  }, []);

  // Items
  const addItem = useCallback(async (text: string) => {
    const storageItems = await getAllItems();
    const newStorageItem: StorageItemType = {
      id: uid(),
      text,
      events: [],
      creationDate: now(),
    };
    storageItems.push(newStorageItem);
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(storageItems));
    const { events, ...rest } = newStorageItem;
    return rest as ItemType;
  }, []);

  const removeItem = useCallback(async (itemId: ItemID) => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return itemId;
    const storageItems = JSON.parse(raw) as StorageItemType[];
    const filteredStorageItems = storageItems.filter(
      (storageItem) => storageItem.id !== itemId
    );
    await AsyncStorage.setItem(
      ITEMS_STORAGE_KEY,
      JSON.stringify(filteredStorageItems)
    );
    return itemId;
  }, []);

  const removeItems = useCallback(async (itemIds: ItemID[]) => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return;
    const storageItems = JSON.parse(raw) as StorageItemType[];
    const filteredStorageItems = storageItems.filter(
      (storageItem) => !itemIds.includes(storageItem.id)
    );
    await AsyncStorage.setItem(
      ITEMS_STORAGE_KEY,
      JSON.stringify(filteredStorageItems)
    );
  }, []);

  // Events
  const addEvent = useCallback(async (title: string) => {
    const storageEvents = await getAllEvents();
    const newStorageEvent: StorageEventType = {
      id: uid(),
      title,
      items: [],
      creationDate: now(),
    };
    storageEvents.push(newStorageEvent);
    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(storageEvents)
    );
    const { items, ...rest } = newStorageEvent;
    return rest as EventType;
  }, []);

  const removeEvent = useCallback(async (eventId: EventID) => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return eventId;
    const storageEvents = JSON.parse(raw) as StorageEventType[];
    const filteredStorageEvents = storageEvents.filter(
      (storageItem) => storageItem.id !== eventId
    );
    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(filteredStorageEvents)
    );
    return eventId;
  }, []);

  // EventItems
  const attachItems = useCallback(
    async (itemIds: ItemID[], eventIds: EventID[]) => {
      const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return;
      const storageEvents = JSON.parse(raw) as StorageEventType[];

      const updatedEvents = storageEvents.map((storageEvent) => {
        if (!eventIds.includes(storageEvent.id)) return storageEvent;
        const eventItemsSet = new Set(storageEvent.items);
        itemIds.forEach((itemId) => {
          if (!eventItemsSet.has(itemId)) {
            eventItemsSet.add(itemId);
          }
        });
        return { ...storageEvent, items: Array.from(eventItemsSet) };
      });

      await AsyncStorage.setItem(
        EVENTS_STORAGE_KEY,
        JSON.stringify(updatedEvents)
      );
    },
    []
  );

  const detachItems = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return;
      const storageEvents = JSON.parse(raw) as StorageEventType[];

      const event = storageEvents.find(
        (storageEvent) => storageEvent.id === eventId
      );

      if (!event) throw new Error(`Event ${eventId} not found`);

      const filteredItems = event.items.filter(
        (itemId) => !itemIds.includes(itemId)
      );

      event.items = filteredItems; // mutate event in storageEvents

      await AsyncStorage.setItem(
        EVENTS_STORAGE_KEY,
        JSON.stringify(storageEvents)
      );
    },
    []
  );

  const clearItems = useCallback(async () => {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify([]));
  }, []);

  const clearEvents = useCallback(async () => {
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify([]));
  }, []);

  return {
    getAllItems,
    getAllEvents,
    seeAllItems,
    seeAllEvents,
    addItem,
    removeItem,
    removeItems,
    addEvent,
    removeEvent,
    attachItems,
    detachItems,
    clearItems,
    clearEvents,
  };
};

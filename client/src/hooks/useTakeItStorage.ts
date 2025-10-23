import { ItemID, ItemType } from "../types/item";
import { EventID, EventType } from "../types/event";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageItemType = ItemType & {
  events: EventID[];
};

type StorageEventType = EventType & {
  items: ItemID[];
};

type Storage = {
  getAllItems: () => Promise<ItemType[]>;
  getAllEvents: () => Promise<EventType[]>;
  // Items
  addItem: (text: string) => Promise<ItemType>;
  removeItem: (itemId: ItemID) => Promise<ItemID>;
  // Events
  addEvent: (title: string) => Promise<EventType>;
  removeEvent: (eventId: EventID) => Promise<ItemID>;
  // Привязка item к событию
  attachItem: (
    eventId: number,
    itemId: number
  ) => Promise<{ eventId: number; itemId: number }>;
  detachItem: (
    itemId: number,
    eventId: number
  ) => Promise<{ itemId: number; eventId: number }>;
};

const ITEMS_STORAGE_KEY = "items_storage";
const EVENTS_STORAGE_KEY = "events_storage";

const now = () => new Date().toISOString();
const uid = () => Number(Math.random().toString(36).slice(2));

export const useTakeItStorage = (): Storage => {
  const getAllItems = async () => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const storageItems = JSON.parse(raw) as StorageItemType[];
    const items: ItemType[] = storageItems.map(({ events, ...rest }) => ({
      ...rest,
    }));
    return items;
  };

  const getAllEvents = async () => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const storageItems = JSON.parse(raw) as StorageEventType[];
    const events: EventType[] = storageItems.map(({ items, ...rest }) => rest);
    return events;
  };

  // Items
  const addItem = async (text: string) => {
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
  };

  const removeItem = async (itemId: ItemID) => {
    return itemId;
    // TODO REMOVE complete implementation
  };

  // Events
  const addEvent = async (title: string) => {
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
  };

  const removeEvent = async (eventId: EventID) => {
    return eventId;
    // TODO REMOVE complete implementation
  };

  // EventItems
  const attachItem = async (itemId: number, eventId: number) => {
    const storageItems = await getAllItems();
    const storageEvents = await getAllEvents();
    // TODO REMOVE complete implementation
    return { itemId, eventId };
  };

  const detachItem = async (itemId: number, eventId: number) => {
    // TODO REMOVE complete implementation
    return { itemId, eventId };
  };

  return {
    getAllItems,
    getAllEvents,
    addItem,
    removeItem,
    addEvent,
    removeEvent,
    attachItem,
    detachItem,
  };
};

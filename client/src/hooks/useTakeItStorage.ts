import { ItemID, ItemType } from "@/types/item";
import { EventID, EventItem, EventType } from "@/types/event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useCallback } from "react";

type Storage = {
  getAllItems: () => Promise<ItemType[]>;
  getAllEvents: () => Promise<EventType[]>;
  // Items
  addItems: (itemTitles: string[]) => Promise<void>;
  removeItems: (itemIds: ItemID[]) => Promise<void>;
  // Events
  addEvent: (title: string) => Promise<EventType>;
  removeEvents: (eventIds: EventID[]) => Promise<void>;
  checkItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
  uncheckItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
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

const normalizeEventItem = (item: EventItem | ItemID): EventItem => {
  if (typeof item === "string") {
    return { itemId: item, checked: false };
  }
  return {
    itemId: item.itemId,
    checked: Boolean(item.checked),
  };
};

const normalizeEvent = (event: EventType): EventType => ({
  ...event,
  items: Array.isArray(event.items)
    ? event.items.map(normalizeEventItem)
    : [],
});

export const useTakeItStorage = (): Storage => {
  // AsyncStorage.clear()
  const getAllItems = useCallback(async () => {
    const raw = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as ItemType[];
    return items;
  }, []);

  const getAllEvents = useCallback(async () => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const events = JSON.parse(raw) as EventType[];
    return events.map(normalizeEvent);
  }, []);

  // Items
  const addItems = useCallback(
    async (itemTitles: string[]) => {
      const storageItems = await getAllItems();
      itemTitles.forEach((title) => {
        const newStorageItem: ItemType = {
          id: uid(),
          text: title,
          creationDate: now(),
        };
        storageItems.push(newStorageItem);
      });

      await AsyncStorage.setItem(
        ITEMS_STORAGE_KEY,
        JSON.stringify(storageItems)
      );
    },
    [getAllItems]
  );

  const removeItems = useCallback(async (itemIds: ItemID[]) => {
    const rawEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const rawItems = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!rawEvents || !rawItems) return;

    const stEvents = (JSON.parse(rawEvents) as EventType[]).map(normalizeEvent);
    const stItems = JSON.parse(rawItems) as ItemType[];

    const updatedStEvents = stEvents.map((stEvent) => {
      const updatedItems = stEvent.items.filter(
        (eventItem) => !itemIds.includes(eventItem.itemId)
      );
      return { ...stEvent, items: updatedItems };
    });

    const filteredStItems = stItems.filter(
      (stItem) => !itemIds.includes(stItem.id)
    );

    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(updatedStEvents)
    );

    await AsyncStorage.setItem(
      ITEMS_STORAGE_KEY,
      JSON.stringify(filteredStItems)
    );
  }, []);

  // Events
  const addEvent = useCallback(async (title: string) => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    let storageEvents: EventType[] = [];
    if (raw) {
      storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);
    }
    const newStorageEvent: EventType = {
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
    return newStorageEvent;
  }, []);

  const removeEvents = useCallback(async (eventIds: EventID[]) => {
    const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return;
    const storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);
    const filteredStorageEvents = storageEvents.filter(
      (storageEvent) => !eventIds.includes(storageEvent.id)
    );
    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(filteredStorageEvents)
    );
  }, []);

  const checkItems = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return;
      const storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);

      let foundEvent = false;
      const updatedEvents = storageEvents.map((storageEvent) => {
        if (storageEvent.id !== eventId) return storageEvent;
        foundEvent = true;

        const items = storageEvent.items.map((eventItem) =>
          itemIds.includes(eventItem.itemId)
            ? { ...eventItem, checked: true }
            : eventItem
        );

        return { ...storageEvent, items };
      });

      if (!foundEvent) throw new Error(`Event ${eventId} not found`);

      await AsyncStorage.setItem(
        EVENTS_STORAGE_KEY,
        JSON.stringify(updatedEvents)
      );
    },
    []
  );

  const uncheckItems = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return;
      const storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);

      let foundEvent = false;
      const updatedEvents = storageEvents.map((storageEvent) => {
        if (storageEvent.id !== eventId) return storageEvent;
        foundEvent = true;

        const items = storageEvent.items.map((eventItem) =>
          itemIds.includes(eventItem.itemId)
            ? { ...eventItem, checked: false }
            : eventItem
        );

        return { ...storageEvent, items };
      });

      if (!foundEvent) throw new Error(`Event ${eventId} not found`);

      await AsyncStorage.setItem(
        EVENTS_STORAGE_KEY,
        JSON.stringify(updatedEvents)
      );
    },
    []
  );

  // EventItems
  const attachItems = useCallback(
    async (itemIds: ItemID[], eventIds: EventID[]) => {
      const raw = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return;
      const storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);

      const updatedEvents = storageEvents.map((storageEvent) => {
        if (!eventIds.includes(storageEvent.id)) return storageEvent;

        const itemsMap = new Map(
          storageEvent.items.map((eventItem) => [eventItem.itemId, eventItem])
        );

        itemIds.forEach((itemId) => {
          if (!itemsMap.has(itemId)) {
            itemsMap.set(itemId, { itemId, checked: false });
          }
        });

        return { ...storageEvent, items: Array.from(itemsMap.values()) };
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
      const storageEvents = (JSON.parse(raw) as EventType[]).map(normalizeEvent);

      const event = storageEvents.find(
        (storageEvent) => storageEvent.id === eventId
      );

      if (!event) throw new Error(`Event ${eventId} not found`);

      const filteredItems = event.items.filter(
        (eventItem) => !itemIds.includes(eventItem.itemId)
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
    addItems,
    removeItems,
    addEvent,
    removeEvents,
    checkItems,
    uncheckItems,
    attachItems,
    detachItems,
    clearItems,
    clearEvents,
  };
};

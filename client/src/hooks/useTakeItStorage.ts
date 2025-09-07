import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { ItemType } from "../types/item";
import { EventType } from "../types/event";
import { EventItemType } from "../types/eventItem";

type Storage = {
  items: ItemType[];
  events: EventType[];
  eventItems: EventItemType[];
};

type Store = Storage & {
  // Items (мастер)
  addItem: (text: string) => number;
  removeItem: (itemId: number) => void;

  // Events
  addEvent: (title: string) => number;
  removeEvent: (eventId: number) => void;

  // Привязка item к событию
  attachItem: (eventId: number, itemId: number) => number;
  detachItem: (eventItemId: number) => void;
  toggleEventItem: (eventItemId: number) => void;
};

const version = 1;
const mmkv = new MMKV();

console.log("Все ключи:", mmkv.getAllKeys()); //TODO REMOVE
console.log("items:", mmkv.getString("take_it_storage_v1")); //TODO REMOVE

const storage = createJSONStorage(() => ({
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.delete(key),
}));

const now = () => new Date().toISOString();
const uid = () => Number(Math.random().toString(36).slice(2));

export const useTakeItStorage = create<Store>()(
  persist(
    (set, get) => ({
      // INITIAL STATE
      items: [],
      events: [],
      eventItems: [],

      // ACTIONS
      // Items
      addItem: (text: string) => {
        const id = uid();
        const item = { id, text, creationDate: now() };
        set((s) => ({ items: [item, ...s.items] }));
        return id;
      },
      removeItem: (itemId: number) => {
        set((s) => ({
          items: s.items.filter((item) => item.id !== itemId),
          eventItems: s.eventItems.filter(
            (eventItem) => eventItem.itemId !== itemId
          ),
        }));
      },

      // Events
      addEvent: (title: string) => {
        const id = uid();
        const event = { id, title, creationDate: now() };
        set((s) => ({ events: [event, ...s.events] }));
        return id;
      },
      removeEvent: (eventId: number) => {
        set((s) => ({
          events: s.events.filter((event) => event.id !== eventId),
          eventItems: s.eventItems.filter(
            (eventItem) => eventItem.eventId !== eventId
          ),
        }));
      },

      // EventItems
      attachItem: (eventId: number, itemId: number) => {
        const id = uid();
        const ei = { id, eventId, itemId, addedAt: now() };
        set((s) => ({ eventItems: [ei, ...s.eventItems] }));
        return id;
      },
      detachItem: (eventItemId: number) => {
        set((s) => ({
          eventItems: s.eventItems.filter(
            (eventItem) => eventItem.id !== eventItemId
          ),
        }));
      },
      toggleEventItem: (eventItemId: number) => {
        set((s) => ({
          eventItems: s.eventItems.map((eventItem) =>
            eventItem.id === eventItemId
              ? { ...eventItem, checked: !eventItem.checked }
              : eventItem
          ),
        }));
      },
      setEventItemQty: (eventItemId: number) => {
        set((s) => ({
          eventItems: s.eventItems.map((eventItem) =>
            eventItem.id === eventItemId ? { ...eventItem } : eventItem
          ),
        }));
      },
    }),
    {
      name: `take_it_storage_v${version}`,
      storage,
      version,
      // migrate: (state, version) => { ... },
    }
  )
);

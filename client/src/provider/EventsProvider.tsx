import React, { createContext, useCallback, useEffect, useState } from "react";
import { EventID, EventType } from "@/types/event";
import { useStorage } from "./StorageProvider";
import { ItemID } from "@/types/item";

type EventsCtx = {
  events: EventType[];
  loadEvents: () => Promise<void>;
  getAllEvents: () => Promise<EventType[]>;
  getEvents: (eventIds: EventID[]) => Promise<EventType[]>;
  addEvent: (title: string) => Promise<EventType>;
  deleteEvents: (eventIds: EventID[]) => Promise<void>;
  clearEvents: () => Promise<void>;
  attachItems: (itemIds: ItemID[], eventIds: EventID[]) => Promise<void>;
  checkItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
  uncheckItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
  detachItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
};

export const EventsContext = createContext<EventsCtx>({
  events: [],
  loadEvents: async () => undefined,
  getAllEvents: async () => [],
  getEvents: async () => [],
  addEvent: async () => ({}) as EventType,
  deleteEvents: async () => undefined,
  attachItems: async () => {},
  checkItems: async () => {},
  uncheckItems: async () => {},
  detachItems: async () => {},
  clearEvents: async () => {},
});

export const EventsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    getAllEvents,
    addEvent,
    removeEvents,
    clearEvents,
    attachItems,
    checkItems,
    uncheckItems,
    detachItems,
  } = useStorage();

  const [events, setEvents] = useState<EventType[]>([]);

  const loadEvents = useCallback(async () => {
    const allEvents = await getAllEvents();
    setEvents(allEvents);
  }, [getAllEvents]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Events - provider...");
        await loadEvents();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [loadEvents]);

  useEffect(() => {
    (async () => {
      const map = new Map();
      const allEvents = await getAllEvents();
      allEvents.forEach((ev) => {
        map.set(
          ev.title,
          ev.items.map((eventItem) => eventItem.itemId)
        );
      });
      // console.log(map); //TODO REMOVE
    })();
  }, [getAllEvents, events]);

  const addEventHandler = useCallback(
    async (title: string) => {
      const newEvent = await addEvent(title);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    },
    [addEvent]
  );

  const getEventsByIds = useCallback(
    async (eventIds: EventID[]) => {
      if (!eventIds.length) return [];
      const allEvents = await getAllEvents();
      const ids = new Set(eventIds);
      return allEvents.filter((event) => ids.has(event.id));
    },
    [getAllEvents]
  );

  const deleteEventsHandler = useCallback(
    async (eventIds: EventID[]) => {
      await removeEvents(eventIds);
      await loadEvents();
    },
    [loadEvents, removeEvents]
  );

  const attachItemsHandler = useCallback(
    async (itemIds: ItemID[], eventIds: EventID[]) => {
      await attachItems(itemIds, eventIds);
      await loadEvents();
    },
    [attachItems, loadEvents]
  );

  const detachItemsHandler = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      await detachItems(itemIds, eventId);
      await loadEvents();
    },
    [detachItems, loadEvents]
  );

  const checkItemsHandler = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      await checkItems(itemIds, eventId);
      await loadEvents();
    },
    [checkItems, loadEvents]
  );

  const uncheckItemsHandler = useCallback(
    async (itemIds: ItemID[], eventId: EventID) => {
      await uncheckItems(itemIds, eventId);
      await loadEvents();
    },
    [loadEvents, uncheckItems]
  );

  const value = React.useMemo<EventsCtx>(
    () => ({
      events,
      loadEvents,
      getAllEvents,
      getEvents: getEventsByIds,
      addEvent: addEventHandler,
      deleteEvents: deleteEventsHandler,
      attachItems: attachItemsHandler,
      detachItems: detachItemsHandler,
      checkItems: checkItemsHandler,
      uncheckItems: uncheckItemsHandler,
      clearEvents,
    }),
    [
      events,
      loadEvents,
      getAllEvents,
      getEventsByIds,
      addEventHandler,
      deleteEventsHandler,
      attachItemsHandler,
      detachItemsHandler,
      checkItemsHandler,
      uncheckItemsHandler,
      clearEvents,
    ]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

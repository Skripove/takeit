import React, { createContext, useCallback, useEffect, useState } from "react";
import { EventID, EventType } from "../types/event";
import { StorageEventType, useTakeItStorage } from "../hooks/useTakeItStorage";
import { ItemID } from "../types/item";

type EventsCtx = {
  events: EventType[];
  getAllEvents: () => Promise<EventType[]>;
  seeAllEvents: () => Promise<StorageEventType[]>;
  addEvent: (title: string) => Promise<EventType>;
  deleteEvents: (eventIds: EventID[]) => Promise<void>;
  clearEvents: () => Promise<void>;
  attachItems: (itemIds: ItemID[], eventIds: EventID[]) => Promise<void>;
  detachItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
};

export const EventsContext = createContext<EventsCtx>({
  events: [],
  getAllEvents: async () => [],
  seeAllEvents: async () => [],
  addEvent: async () => ({}) as EventType,
  deleteEvents: async () => undefined,
  attachItems: async () => {},
  detachItems: async () => {},
  clearEvents: async () => {},
});

export const EventsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    getAllEvents,
    seeAllEvents,
    addEvent,
    removeEvents,
    clearEvents,
    attachItems,
    detachItems,
  } = useTakeItStorage();

  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching Events - provider...");
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAllEvents]);

  const addEventHandler = useCallback(async (title: string) => {
    const newEvent = await addEvent(title);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  const deleteEventsHandler = useCallback(async (eventIds: EventID[]) => {
    await removeEvents(eventIds);
    setEvents((prev) =>
      prev.filter((prevEvent) => !eventIds.includes(prevEvent.id))
    );
  }, []);

  const value = React.useMemo<EventsCtx>(
    () => ({
      events,
      getAllEvents,
      seeAllEvents,
      addEvent: addEventHandler,
      deleteEvents: deleteEventsHandler,
      attachItems,
      detachItems,
      clearEvents,
    }),
    [
      events,
      getAllEvents,
      seeAllEvents,
      addEventHandler,
      deleteEventsHandler,
      attachItems,
      detachItems,
      clearEvents,
    ]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

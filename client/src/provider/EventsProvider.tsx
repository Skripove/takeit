import React, { createContext } from "react";
import { EventID, EventType } from "../types/event";
import { StorageEventType, useTakeItStorage } from "../hooks/useTakeItStorage";
import { ItemID } from "../types/item";

type EventsCtx = {
  getAllEvents: () => Promise<EventType[]>;
  seeAllEvents: () => Promise<StorageEventType[]>;
  addEvent: (title: string) => Promise<EventType>;
  removeEvent: (eventId: EventID) => Promise<EventID>;
  removeEvents: (eventIds: EventID[]) => Promise<void>;
  clearEvents: () => Promise<void>;
  attachItems: (itemIds: ItemID[], eventIds: EventID[]) => Promise<void>;
  detachItems: (itemIds: ItemID[], eventId: EventID) => Promise<void>;
};

export const EventsContext = createContext<EventsCtx>({
  getAllEvents: async () => [],
  seeAllEvents: async () => [],
  addEvent: async () => ({}) as EventType,
  removeEvent: async () => "",
  removeEvents: async () => undefined,
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
    removeEvent,
    removeEvents,
    clearEvents,
    attachItems,
    detachItems,
  } = useTakeItStorage();

  const value = React.useMemo<EventsCtx>(
    () => ({
      getAllEvents,
      seeAllEvents,
      addEvent,
      removeEvent,
      removeEvents,
      attachItems,
      detachItems,
      clearEvents,
    }),
    [
      getAllEvents,
      seeAllEvents,
      addEvent,
      removeEvent,
      removeEvents,
      attachItems,
      detachItems,
      clearEvents,
    ]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

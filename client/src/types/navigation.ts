import { EventID } from "./event";

export type EventsStackParamList = {
  EventsCollection: undefined;
  Event: { eventId: EventID };
};

export type RootTabParamList = {
  Events: undefined;
  Items: undefined;
};

import { EventID } from "./event";
import { ItemID } from "./item";

export type EventItemID = number;

export type EventItemType = {
  id: EventItemID;
  eventId: EventID;
  itemId: ItemID;
  addedAt: string;
  checked?: boolean;
};

import { ItemID } from "./item";

export type EventID = string;

export type EventType = {
  id: EventID;
  title: string;
  creationDate: string;
  items: ItemID[];
  // checkedItems: ItemID[];
};

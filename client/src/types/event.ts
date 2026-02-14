import { ItemID } from "@/types/item";

export type EventID = string;

export type EventItem = {
  itemId: ItemID;
  checked: boolean;
};

export type EventType = {
  id: EventID;
  title: string;
  creationDate: string;
  items: EventItem[];
};

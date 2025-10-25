export type EventID = string;

export type EventType = {
  id: EventID;
  title: string;
  creationDate: string;
  checked?: boolean;
};

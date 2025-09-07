export type ItemID = number;

export type ItemType = {
  id: ItemID;
  text: string;
  creationDate: string;
  checked?: boolean;
};

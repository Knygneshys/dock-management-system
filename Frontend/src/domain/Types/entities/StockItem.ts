import type { StorageArea } from "./StorageArea";

export type StockItem = {
  containerISO: string;
  description: string;
  from: string;
  to: string;
  availableSince: string;
  availableUntil: string;
  storageArea: StorageArea;
};

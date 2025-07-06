import type { LineItem } from "./LineItem";

type FloorItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  flats: FlatItem[];
};

type FlatItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  areas: AreaItem[];
};

type AreaItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  lineItems: LineItem[];
};

export type { FloorItem, FlatItem, AreaItem };

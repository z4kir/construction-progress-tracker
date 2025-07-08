import type { LineItem } from "./LineItem";

type FloorItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  floorIndex?:number;
  flats: FlatItem[];
};

type FlatItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  flateIndex?:number;
  areas: AreaItem[];
};

type AreaItem = {
  id: string;
  name: string;
  progress: number;
  isCompleted: boolean;
  collapse: boolean;
  areaIndex?:number;
  lineItems: LineItem[];
};

export type { FloorItem, FlatItem, AreaItem };

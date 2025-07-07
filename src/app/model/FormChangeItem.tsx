export type FormChangeItem = {
  value?: boolean;
  area: "FLOOR" | "FLAT" | "AREA" | "LINE";
  isCheckChange: boolean;
  floorIndex?: number;
  flateIndex?: number;
  areaIndex?: number;
  lineIndex?: number;
};

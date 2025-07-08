export type FormChangeItem = {
  value: boolean|string|number;
  field:string;
  area: "FLOOR" | "FLAT" | "AREA" | "LINE";
  isCheckChange: boolean;
  floorIndex?: number;
  flateIndex?: number;
  areaIndex?: number;
  lineIndex?: number;
};

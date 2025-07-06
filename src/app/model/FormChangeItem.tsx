export type FormChangeItem = {
  area: "FLOOR" | "FLAT" | "AREA"|"LINE",
  isCheckChange: boolean,
  // isCollapseChange: boolean,
  floorIndex?: number,
  flateIndex?: number,
  areaIndex?: number,
  lineIndex?: number,
};

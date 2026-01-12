export const cargoType = {
  Dry: "Dry",
  Refrigerated: "Refrigerated",
  Hazardous: "Hazardous",
  Liquid: "Liquid",
  General: "General"
} as const;

export type CargoType = keyof typeof cargoType;

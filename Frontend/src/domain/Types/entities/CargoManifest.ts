import type { CargoType } from "../../Enums/cargoType";
import type { CargoItem } from "./CargoItem";

export type CargoManifest = {
  code: string;
  description: string;
  cargoType: CargoType;
  cargoItems: CargoItem[];
};

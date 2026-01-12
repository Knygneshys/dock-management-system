import type { CargoType } from "../../../domain/Enums/cargoType";

export type LoadCargoManifestDto = {
  code: string;
  description: string;
  cargoType: CargoType;
  cargoItemCodes: string[];
};

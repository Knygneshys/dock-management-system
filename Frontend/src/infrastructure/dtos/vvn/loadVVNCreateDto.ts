import type { LoadCargoManifestDto } from "../cargo-manifest/loadCargoManifestDto";
import type { VVNCreateDto } from "./vvnCreateDto";

export type LoadVVNCreateDto = VVNCreateDto & {
  cargoManifestDTO: LoadCargoManifestDto;
};

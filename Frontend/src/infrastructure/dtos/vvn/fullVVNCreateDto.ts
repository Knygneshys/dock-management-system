import type { LoadCargoManifestDto } from "../cargo-manifest/loadCargoManifestDto";
import type { UnloadCargoManifestDto } from "../cargo-manifest/unloadCargoManifestDto";
import type { VVNCreateDto } from "./vvnCreateDto";

export type FullVVNCreateDto = VVNCreateDto & {
  cargoLoadManifestDTO: LoadCargoManifestDto;
  cargoUnloadManifestDTO: UnloadCargoManifestDto;
};

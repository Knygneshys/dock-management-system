import type { UnloadCargoManifestDto } from "../cargo-manifest/unloadCargoManifestDto";
import type { VVNCreateDto } from "./vvnCreateDto";

export type UnloadVVNCreateDto = VVNCreateDto & {
  cargoManifestDTO: UnloadCargoManifestDto;
};

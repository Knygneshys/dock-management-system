import type { CargoManifest } from "./CargoManifest";
import type { DockRecord } from "./DockRecord";
import type { ShippingAgentRepresentative } from "./ShippingAgentRepresentative";
import type { Vessel } from "./Vessel";

export type VVN = {
  code: number;
  eta: string;
  etd: string;
  status: string;
  vessel: Vessel;
  shippingAgentRepresentative: ShippingAgentRepresentative;
  dock?: DockRecord;
  cargoLoadManifest?: CargoManifest;
  cargoUnloadManifest?: CargoManifest;
};

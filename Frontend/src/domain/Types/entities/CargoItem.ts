import type { ContainerPosition } from "../value-objects/ContainerPosition";

export type CargoItem = {
  containerISO: string;
  description: string;
  from: string;
  to: string;
  vesselContainerPosition: ContainerPosition;
};

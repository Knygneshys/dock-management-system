import type { ContainerPosition } from "../value-objects/ContainerPosition";

export type PlannedOperation = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

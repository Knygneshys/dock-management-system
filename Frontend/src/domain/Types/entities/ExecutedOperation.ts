import { ContainerPosition } from "../value-objects/ContainerPosition";

export type ExecutedOperation = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

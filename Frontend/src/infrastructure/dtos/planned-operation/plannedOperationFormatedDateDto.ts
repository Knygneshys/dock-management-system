import type { ContainerPosition } from "../../../domain/Types/value-objects/ContainerPosition";

export type plannedOperationFormatedDateDto = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

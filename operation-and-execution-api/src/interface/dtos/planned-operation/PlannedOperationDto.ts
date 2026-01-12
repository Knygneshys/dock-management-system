import { ContainerPosition } from '../../../domain/object-values/ContainerPosition';

export type PlannedOperationDto = {
  start: string;
  end: string;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

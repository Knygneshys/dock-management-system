import { ContainerPosition } from '../../../domain/object-values/ContainerPosition';

export type ExecutedOperationResponseDto = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

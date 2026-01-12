import { ContainerPosition } from '../../../domain/object-values/ContainerPosition';

export type CreateExecutedOperationCommand = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

import { ContainerPosition } from '../../domain/object-values/ContainerPosition';

export type IExecutedOperationPersistence = {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
};

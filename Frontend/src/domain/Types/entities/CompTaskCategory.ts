import { Time } from "../value-objects/Time";

export type CompTaskCategory = {
  code: string;
  name: string;
  description?: string;
  defaultDelay?: Time;
};

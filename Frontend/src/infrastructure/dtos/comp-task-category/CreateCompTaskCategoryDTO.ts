import { Time } from "../../../domain/Types/value-objects/Time";

export type CreateCompTaskCategoryDTO = {
  name: string;
  description: string;
  defaultDelay?: Time;
};

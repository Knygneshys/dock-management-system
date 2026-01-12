import { AlgorithType } from "../../../domain/Enums/algorithmTypes";

export type SchedulingGetDailyQuery = {
  date: string;
  algorithmType: AlgorithType;
};

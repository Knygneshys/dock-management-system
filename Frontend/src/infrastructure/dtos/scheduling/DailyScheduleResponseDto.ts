import { AlgorithType } from "../../../domain/Enums/algorithmTypes";
import type { DailyScheduleItemDto } from "./DailyScheduleItemDto";

export type DailyScheduleResponseDto = {
  ok: boolean;
  date: string;
  totalDelay: number;
  items: DailyScheduleItemDto[];
  reason?: string;
  algorithmsUsed: AlgorithType[];
  computeDurationMs: number;
};

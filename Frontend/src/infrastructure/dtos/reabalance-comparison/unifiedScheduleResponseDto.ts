import type { UnifiedScheduleItemDto } from "./unifiedScheduleItemDto";

export type UnifiedScheduleResponseDto = {
  ok: boolean;
  date: string;
  totalDelay: number;
  items: UnifiedScheduleItemDto[];
};
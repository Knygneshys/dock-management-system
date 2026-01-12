import { DailyScheduleResponseDto } from "../scheduling/DailyScheduleResponseDto";
import type { VesselDockChangeDto } from "./vesselDockChangeDto";

export type RebalanceComparisonDto = {
  oldSchedule: DailyScheduleResponseDto;
  newSchedule: DailyScheduleResponseDto;
  dockChanges: VesselDockChangeDto[];
};
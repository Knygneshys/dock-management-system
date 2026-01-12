export type UnifiedScheduleItemDto = {
  vesselName: string;
  dockCode: string;
  craneCodes: string[];
  staffCodes: string[];
  start: number;
  end: number;
};
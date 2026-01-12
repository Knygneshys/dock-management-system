import type { DAYS_OF_WEEK } from "../../Enums/daysOfWeek";

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type OperationalWindow = {
  code: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

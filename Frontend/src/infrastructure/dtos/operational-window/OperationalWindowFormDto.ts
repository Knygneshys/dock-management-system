import { DAYS_OF_WEEK } from "../../../domain/Enums/daysOfWeek";

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type operationalWindowFormDto = {
  code: string;
  dayOfWeek: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

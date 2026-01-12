import type { DayOfWeek } from "../../../domain/Types/entities/OperationalWindow";

export type OWCommand = {
  code: string;
  dayOfWeek: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

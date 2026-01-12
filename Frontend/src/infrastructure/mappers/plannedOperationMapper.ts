import type { PlannedOperation } from "../../domain/Types/entities/PlannedOperation";
import { minutesToHoursAndMinutesString } from "../../presentation/utils/timeUtils";
import type { plannedOperationFormatedDateDto } from "../dtos/planned-operation/plannedOperationFormatedDateDto";

export function mapPlannedOperationToPlannedOperationFormatedDateDto(
  plannedOperation: PlannedOperation,
  date: string,
): plannedOperationFormatedDateDto {
  const formatedStartDate = new Date(
    `${date} ${minutesToHoursAndMinutesString(Number(plannedOperation.start) % (24 * 60))}`,
  );
  const formatedEndDate = new Date(
    `${date} ${minutesToHoursAndMinutesString(Number(plannedOperation.end) % (24 * 60))}`,
  );

  return {
    start: new Date(formatedStartDate.toISOString()),
    end: new Date(formatedEndDate.toISOString()),
    from: plannedOperation.from,
    to: plannedOperation.to,
    containerId: plannedOperation.containerId,
  };
}

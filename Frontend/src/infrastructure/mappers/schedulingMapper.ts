import { AlgorithType } from "../../domain/Enums/algorithmTypes";
import { minutesToHoursAndMinutesString } from "../../presentation/utils/timeUtils";
import type { createOperationPlanCommand } from "../dtos/scheduling/createOperationPlanCommand";
import type { DailyScheduleItemDto } from "../dtos/scheduling/DailyScheduleItemDto";
import { mapPlannedOperationToPlannedOperationFormatedDateDto } from "./plannedOperationMapper";

export function mapDailyScheduleItemDtoToCreateOperationPlanCommand(
  itemDto: DailyScheduleItemDto,
  date: string,
  algorithm: AlgorithType,
  creatorUserEmail: string,
  isRegenerated?: boolean
): createOperationPlanCommand {
  const plannedOperationFormatedDateDtos = itemDto.plannedOperations.map((po: any) =>
    mapPlannedOperationToPlannedOperationFormatedDateDto(po, date)
  );

  const formatedStartDate = new Date(`${date} ${minutesToHoursAndMinutesString(itemDto.start * 60)}`);

  const formatedEndDate = new Date(`${date} ${minutesToHoursAndMinutesString(itemDto.end * 60)}`);

  return {
    vvnCode: itemDto.vvnCode,
    dockCode: itemDto.dockCode,
    craneCodes: itemDto.craneCodes,
    staffCodes: itemDto.staffCodes,
    storageAreaCode: itemDto.storageAreaCode,
    start: formatedStartDate.toISOString(),
    end: formatedEndDate.toISOString(),
    usedAlgorithm: algorithm,
    creatorUserEmail: creatorUserEmail,
    plannedOperations: plannedOperationFormatedDateDtos,
    isRegenerated: isRegenerated ?? false
  };
}

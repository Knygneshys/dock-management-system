import axios from "axios";
import { planningUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";
import type { SchedulingGetDailyQuery } from "../../../application/scheduling/queries/schedulingGetDailyQuery";
import type { RebalanceComparisonDto } from "../../dtos/reabalance-comparison/rebalanceComparisonDto";
import { DailyScheduleResponseDto } from "../../dtos/scheduling/DailyScheduleResponseDto";
import { minutesToHoursAndMinutesString } from "../../../presentation/utils/timeUtils";

export const getDailySchedule = async (
  scheduleQuery:
    | (SchedulingGetDailyQuery & { computeTimeMS?: number; [key: string]: any })
    | null,
) => {
  if (scheduleQuery) {
    const params = new URLSearchParams();
    if (scheduleQuery.date) params.append("date", scheduleQuery.date);
    if (scheduleQuery.algorithmType)
      params.append("algorithmType", `${scheduleQuery.algorithmType}`);
    if (
      scheduleQuery.computeTimeMS !== undefined &&
      scheduleQuery.computeTimeMS !== null &&
      !isNaN(scheduleQuery.computeTimeMS)
    ) {
      params.append("computeTimeMS", String(scheduleQuery.computeTimeMS));
    }

    const uri = `${planningUris.GET_DAILY}?${params.toString()}`;

    const response = await apiClient.get<DailyScheduleResponseDto>(uri);

    const dtos = response.data as DailyScheduleResponseDto;

    return dtos;
  }
};

export const getRebalanceComparison = async (dateString: string) => {
  const uri = `${planningUris.GET_REBALANCE_COMPARISON}?date=${dateString}`;
  const response = await apiClient.get(uri);
  return response.data as RebalanceComparisonDto;
};

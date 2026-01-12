import { useQuery } from "@tanstack/react-query";
import { getDailyScheduleQueryKey } from "../../query-keys/planningQueryKeys";
import { getDailySchedule } from "../../../../infrastructure/api/clients/planningApi";
import type { SchedulingGetDailyQuery } from "../../../../application/scheduling/queries/schedulingGetDailyQuery";

export const useGetDailyScheduleQuery = (
  scheduleQuery: SchedulingGetDailyQuery | null,
) => {
  return useQuery({
    queryKey: [...getDailyScheduleQueryKey, scheduleQuery],
    queryFn: async () => {
      const schedule = await getDailySchedule(scheduleQuery);
      if (schedule === undefined) {
        return null;
      }

      return schedule;
    },
    enabled: !!scheduleQuery,
  });
};

export default useGetDailyScheduleQuery;

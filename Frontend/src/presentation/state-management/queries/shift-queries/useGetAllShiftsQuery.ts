import { useQuery } from "@tanstack/react-query";
import { getAllShiftsQueryKey } from "../../query-keys/shiftQueryKey";
import { GetAllShiftsUseCase } from "../../../../application/shifts/ShiftDependencyInjection";

export const useGetAllShiftsQuery = () => {
  return useQuery({
    queryKey: getAllShiftsQueryKey,
    queryFn: GetAllShiftsUseCase,
  });
};
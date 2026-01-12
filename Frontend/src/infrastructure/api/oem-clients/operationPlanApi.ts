import axios, { AxiosError } from "axios";
import { mapDailyScheduleItemDtoToCreateOperationPlanCommand } from "../../mappers/schedulingMapper";
import { operationPlanUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";
import { DailyScheduleResponseDto } from "../../dtos/scheduling/DailyScheduleResponseDto";
import { AlgorithType } from "../../../domain/Enums/algorithmTypes";
import { OperationPlanSearchQuery } from "../../../application/operation-plan/queries/OperationPlanSearchQuery";
import { OperationPlan } from "../../../domain/Types/entities/OperationPlan";
import { UpdateOperationPlanCommand } from "../../../application/operation-plan/commands/UpdateOperationPlanCommand";

export const createOperationPlans = async (
  scheduleDto: DailyScheduleResponseDto,
  algorithm: AlgorithType,
  userEmail: string,
  isRegenerated?: boolean,
) => {
  try {
    const createOperationalPlanCommands = scheduleDto.items.map((item: any) =>
      mapDailyScheduleItemDtoToCreateOperationPlanCommand(
        item,
        scheduleDto.date,
        algorithm,
        userEmail,
        isRegenerated,
      ),
    );

    const promises = createOperationalPlanCommands.map((command: any) =>
      apiClient.post<string>(operationPlanUris.create, command),
    );

    await Promise.all(promises);
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new AxiosError(error?.response?.data.errors.message);
    }
  }
};

export const searchOperationPlans = async (query: OperationPlanSearchQuery) => {
  const params = new URLSearchParams();
  if (query.from !== undefined) {
    params.append("from", query.from.toISOString());
  }
  if (query.to !== undefined) {
    params.append("to", query.to.toISOString());
  }
  if (query.vvnCode !== undefined && query.vvnCode !== null) {
    params.append("vvnCode", query.vvnCode.toString());
  }
  if (query.sortBy !== undefined) {
    params.append("sortBy", query.sortBy);
  }
  if (query.sortDir !== undefined) {
    params.append("sortDir", query.sortDir);
  }

  const uri = `${operationPlanUris.search}?${params.toString()}`;
  console.log(uri);

  const response = await apiClient.get<OperationPlan[]>(uri);

  return response.data;
};

export const updateOperationPlan = async (
  vvnCode: number,
  command: UpdateOperationPlanCommand,
) => {
  try {
    const result = await apiClient.put<OperationPlan>(
      operationPlanUris.update(vvnCode),
      command,
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOperationPlanByCode = async (vvnCode: number) => {
  try {
    const result = await apiClient.get<OperationPlan>(
      operationPlanUris.FIND_BY_CODE(vvnCode),
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

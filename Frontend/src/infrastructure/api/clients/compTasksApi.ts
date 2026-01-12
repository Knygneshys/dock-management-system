
import { CompTaskSearchQuery } from "../../../application/complementary-task/queries/CompTaskSearchQuery";
import { CompTask } from "../../../domain/Types/entities/CompTask";
import { CreateCompTaskDto } from "../../dtos/complementary-tasks/CreateCompTaskDto";
import { UpdateCompTaskDto } from "../../dtos/complementary-tasks/UpdateCompTaskDto";
import { compTaskUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllCompTasks = async () => {
  try {
    const data = await apiClient.get(compTaskUris.GET_ALL);
    return data.data as CompTask[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCompTask = async (compTask: CreateCompTaskDto) => {
  const response = await apiClient.post(compTaskUris.CREATE, compTask);
  return response.data as CompTask;
};

export const getCompTasksByVVE = async (vveCode: number) => {
  try {
    const uri = `${compTaskUris.GET_BY_VVE}/${vveCode}`;
    const data = await apiClient.get(uri);
    return data.data as CompTask[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCompTask = async (
  code: string,
  updatedCompTask: UpdateCompTaskDto
) => {
  try {
    const uri = `${compTaskUris.UPDATE}/${code}`;
    await apiClient.put(uri, updatedCompTask);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchCompTasks = async (
  searchQuery: CompTaskSearchQuery | null
) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();
      
      if (searchQuery.start) {
        params.append("start", searchQuery.start.toISOString());
      }
      if (searchQuery.end) {
        params.append("end", searchQuery.end.toISOString());
      }
      if (searchQuery.status) {
        params.append("status", searchQuery.status);
      }
      
      const uri = `${compTaskUris.SEARCH}?${params.toString()}`;
      const data = await apiClient.get(uri);
      return data.data as CompTask[];
    }
    
    return await getAllCompTasks();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCompTaskByCode = async (code: string) => {
  try {
    const uri = `${compTaskUris.GET_BY_CODE}/${code}`;
    const data = await apiClient.get(uri);
    return data.data as CompTask;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
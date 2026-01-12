import { CompTaskCategorySearchQuery } from "../../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";
import { CompTaskCategory } from "../../../domain/Types/entities/CompTaskCategory";
import { CreateCompTaskCategoryDTO } from "../../dtos/comp-task-category/CreateCompTaskCategoryDTO";
import { compTaskCategoryUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const createCompTaskCategory = async (dto: CreateCompTaskCategoryDTO): Promise<CompTaskCategory> => {
  const res = await apiClient.post<CompTaskCategory>(compTaskCategoryUris.CREATE, dto);
  return res.data;
};

export const searchComplementaryTaskCategories = async (
  query: CompTaskCategorySearchQuery | null
): Promise<CompTaskCategory[]> => {
  if (query) {
    const params = new URLSearchParams();

    if (query.name) {
      params.append("name", query.name);
    }

    const res = await apiClient.get<CompTaskCategory[]>(`${compTaskCategoryUris.SEARCH}?${params.toString()}`);
    return res.data;
  }
  const res = await apiClient.get<CompTaskCategory[]>(compTaskCategoryUris.SEARCH);

  return res.data;
};

import type { QualificationSearchQuery } from "../../../application/qualification/queries/QualificationSearchQuery";
import type { Qualification } from "../../../domain/Types/entities/Qualification";
import type { QualificationUpdateDto } from "../../dtos/qualification/qualificaitonUpdateDto";
import type { QualificationCreateDto } from "../../dtos/qualification/qualificationCreateDto";
import { qualificationUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllQualifications = async () => {
  try {
    const data = await apiClient.get(qualificationUris.GET_ALL);

    return data.data as Qualification[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createQualification = async (
  qualification: QualificationCreateDto
) => {
  try {
    const data = await apiClient.post(qualificationUris.CREATE, qualification);
    const qualificationId = data.data as string;

    return qualificationId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQualificationByCode = async (qualificationCode: string) => {
  try {
    const uri = `${qualificationUris.GET_BY_ID}/${qualificationCode}`;
    const data = await apiClient.get(uri);

    const qualification = data.data;

    return qualification;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateQualification = async (
  qualificationCode: string,
  updatedQualification: QualificationUpdateDto
) => {
  try {
    const uri = `${qualificationUris.UPDATE}/${qualificationCode}`;
    const response = await apiClient.put(uri, updatedQualification);
    return response.data ?? (updatedQualification as Qualification);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchQualifications = async (
  searchQuery: QualificationSearchQuery | null
) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.append("name", searchQuery.name);
      params.append("code", searchQuery.code);
      params.append("operatorType", searchQuery.operatorType);
      const uri = `${qualificationUris.SEARCH}?${params.toString()}`;
      const data = await apiClient.get<Qualification[]>(uri);
      return data.data;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

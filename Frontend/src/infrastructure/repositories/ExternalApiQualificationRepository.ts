import {
  getAllQualifications,
  createQualification,
  updateQualification,
  getQualificationByCode,
  searchQualifications,
} from "../api/clients/qualificationApi";
import type { IQualificationRepository } from "../../domain/interfaces/IQualificationRepository";
import type { Qualification } from "../../domain/Types/entities/Qualification";
import type { CreateQualificationCommand } from "../../application/qualification/commands/CreateQualificationCommand";
import {
  mapCreateQualificationCommandToQualificationCreateDto,
  mapUpdateQualificationCommandToUpdateQualificationDto,
} from "../mappers/qualificationMapper";
import type { UpdateQualificationCommand } from "../../application/qualification/commands/UpdateQualificationCommand";
import type { QualificationUpdateDto } from "../dtos/qualification/qualificaitonUpdateDto";
import type { QualificationSearchQuery } from "../../application/qualification/queries/QualificationSearchQuery";

export const ExternalApiQualificationRepository: IQualificationRepository = {
  getAll: async function (): Promise<Qualification[]> {
    return await getAllQualifications();
  },
  create: async function (
    command: CreateQualificationCommand
  ): Promise<string | null> {
    const createQualificationDto =
      mapCreateQualificationCommandToQualificationCreateDto(command);

    return await createQualification(createQualificationDto);
  },
  update: async function (
    code: string,
    command: UpdateQualificationCommand
  ): Promise<QualificationUpdateDto | null> {
    const updateQualificationDto =
      mapUpdateQualificationCommandToUpdateQualificationDto(command);

    return await updateQualification(code, updateQualificationDto);
  },
  getByCode: async function (code: string): Promise<Qualification | null> {
    return await getQualificationByCode(code);
  },
  getBySearch: async function (
    searchQuery: QualificationSearchQuery
  ): Promise<Qualification[] | null> {
    return await searchQualifications(searchQuery);
  },
};

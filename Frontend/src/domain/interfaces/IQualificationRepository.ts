import type { CreateQualificationCommand } from "../../application/qualification/commands/CreateQualificationCommand";
import type { UpdateQualificationCommand } from "../../application/qualification/commands/UpdateQualificationCommand";
import type { QualificationSearchQuery } from "../../application/qualification/queries/QualificationSearchQuery";
import type { QualificationUpdateDto } from "../../infrastructure/dtos/qualification/qualificaitonUpdateDto";
import type { Qualification } from "../Types/entities/Qualification";

export interface IQualificationRepository {
  getAll(): Promise<Qualification[]>;

  create(command: CreateQualificationCommand): Promise<string | null>;

  update(
    code: string,
    command: UpdateQualificationCommand
  ): Promise<QualificationUpdateDto | null>;

  getByCode(code: string): Promise<Qualification | null>;

  getBySearch(
    searchQuery: QualificationSearchQuery
  ): Promise<Qualification[] | null>;
}

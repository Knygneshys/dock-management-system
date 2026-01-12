import { ExternalApiQualificationRepository } from "../../infrastructure/repositories/ExternalApiQualificationRepository";
import { CreateQualification } from "./use-cases/CreateQualification";
import { GetAllQualifications } from "./use-cases/GetAllQualifications";
import { GetQualificationByCode } from "./use-cases/GetQualificationByCode";
import { GetQualificationBySearch } from "./use-cases/GetQualificationBySearch";
import { UpdateQualification } from "./use-cases/UpdateQualification";

export const GetAllqualificationsUseCase = GetAllQualifications(ExternalApiQualificationRepository);

export const CreateQualificationUseCase = CreateQualification(ExternalApiQualificationRepository);

export const GetQualificationsBySearchUseCase = GetQualificationBySearch(ExternalApiQualificationRepository);

export const UpdateQualificationUseCase = UpdateQualification(ExternalApiQualificationRepository);

export const GetQualificationByCodeUseCase = GetQualificationByCode(ExternalApiQualificationRepository);
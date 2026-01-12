import { ExternalApiIncidentTypeRepository } from "../../infrastructure/repositories/ExternalApiIncidentTypeRepository";
import { CreateIncidentType } from "./use-cases/CreateIncidentType";
import { FindIncidentTypeByCode } from "./use-cases/FindIncidentTypeByCode";
import { SearchIncidentTypes } from "./use-cases/SearchIncidentTypes";
import { UpdateIncidentType } from "./use-cases/UpdateIncidentType";

export const SearchIncidentTypesUseCase = SearchIncidentTypes(
  ExternalApiIncidentTypeRepository,
);

export const CreateIncidentTypeUseCase = CreateIncidentType(
  ExternalApiIncidentTypeRepository,
);

export const UpdateIncidentTypeUseCase = UpdateIncidentType(
  ExternalApiIncidentTypeRepository,
);

export const FindIncidentTypeByCodeUseCase = FindIncidentTypeByCode(
  ExternalApiIncidentTypeRepository,
);

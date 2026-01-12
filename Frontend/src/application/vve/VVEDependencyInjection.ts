import { ExternalApiVVERepository } from "../../infrastructure/repositories/ExternalApiVVERepository";
import { AddExecutedOperationByCode } from "./use-cases/AddExecutedOperationByCode";
import { GetAllVVEs } from "./use-cases/GetAllVVEs";
import { GetExecutedOperationsByCode } from "./use-cases/GetExecutedOperationsByCode";
import { SearchVVEs } from "./use-cases/SearchVVEs";

export const GetAllVVEsUseCase = GetAllVVEs(ExternalApiVVERepository);

export const SearchVVEsUseCase = SearchVVEs(ExternalApiVVERepository);

export const GetExecutedOperationsByCodeUseCase = GetExecutedOperationsByCode(
  ExternalApiVVERepository,
);

export const AddExecutedOperationByCodeUseCase = AddExecutedOperationByCode(
  ExternalApiVVERepository,
);

import { ExternalApiStAreaRepository } from "../../infrastructure/repositories/ExternalApiStAreaRepository";
import { CreateStorageArea } from "./use-cases/CreateStorageArea";
import { GetAllStorageAreas } from "./use-cases/GetAllStorageAreas";
import { GetStAreaById } from "./use-cases/GetStAreaById";
import { GetStAreaBySearch } from "./use-cases/GetStAreaBySearch";
import { UpdateStorageArea } from "./use-cases/UpdateStorageArea";

export const GetAllStAreasUseCase = GetAllStorageAreas(ExternalApiStAreaRepository);

export const CreateStAreaUseCase = CreateStorageArea(ExternalApiStAreaRepository);

export const UpdateStAreaUseCase = UpdateStorageArea(ExternalApiStAreaRepository);

export const GetStAreaByIdUseCase = GetStAreaById(ExternalApiStAreaRepository);

export const GetStAreaBySearchUseCase = GetStAreaBySearch(ExternalApiStAreaRepository);

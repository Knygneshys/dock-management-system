import { GetAllVesselTypes } from "./use-cases/GetAllVesselTypes";
import { ExternalApiVesselTypeRepository } from "../../infrastructure/repositories/ExternalApiVesselTypeRepository";
import { CreateVesselType } from "./use-cases/CreateVesselType";
import { UpdateVesselType } from "./use-cases/UpdateVesselType";
import { GetVesselTypesBySearch } from "./use-cases/GetVesselTypesBySearch";
import { GetVesselTypeById } from "./use-cases/GetVesselTypeById";

export const GetAllVesselTypesUseCase = GetAllVesselTypes(ExternalApiVesselTypeRepository);
export const CreateVesselTypeUseCase = CreateVesselType(ExternalApiVesselTypeRepository);
export const UpdateVesselTypeUseCase = UpdateVesselType(ExternalApiVesselTypeRepository);
export const SearchVesselTypesUseCase = GetVesselTypesBySearch(ExternalApiVesselTypeRepository);
export const GetVesselTypeByIdUseCase = GetVesselTypeById(ExternalApiVesselTypeRepository);
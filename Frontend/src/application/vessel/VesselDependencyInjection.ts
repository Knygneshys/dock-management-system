import { ExternalApiVesselRepository } from "../../infrastructure/repositories/ExternalApiVesselRepository";
import { CreateVessel } from "./use-cases/CreateVessel";
import { GetAllVessels } from "./use-cases/GetAllVessels";
import { GetVesselByImo } from "./use-cases/GetVesselByImo";
import { GetVesselsBySearch } from "./use-cases/GetVesselsBySearch";
import { UpdateVessel } from "./use-cases/UpdateVessel";

export const GetAllVesselsUseCase = GetAllVessels(ExternalApiVesselRepository);

export const CreateVesselUseCase = CreateVessel(ExternalApiVesselRepository);

export const GetVesselsBySearchUseCase = GetVesselsBySearch(ExternalApiVesselRepository);

export const UpdateVesselUseCase = UpdateVessel(ExternalApiVesselRepository);

export const GetVesselByImoUseCase = GetVesselByImo(ExternalApiVesselRepository);
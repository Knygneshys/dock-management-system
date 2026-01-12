import { ExternalApiSARRepository } from "../../infrastructure/repositories/ExternalApiSARRepository";
import { CreateSar } from "./use-cases/CreateSar";
import { GetAllSars } from "./use-cases/GetAllSars";
import { GetAllSarVVNs } from "./use-cases/GetAllSarVVNs";

export const CreateSarUseCase = CreateSar(ExternalApiSARRepository);
export const GetAllSarsUseCase = GetAllSars(ExternalApiSARRepository);
export const GetAllSarVVNsUseCase = GetAllSarVVNs(ExternalApiSARRepository);

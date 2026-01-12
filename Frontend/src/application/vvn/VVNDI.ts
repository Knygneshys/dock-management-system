import { ExternalApiVVNRepository } from "../../infrastructure/repositories/ExternalApiVVNRepository";
import { AproveVVN } from "./use-cases/AproveVVN";
import { CreateFullVVN } from "./use-cases/CreateFullVVN";
import { CreateLoadVVN } from "./use-cases/CreateLoadVVN";
import { CreateMaintenenceVVN } from "./use-cases/CreateMaintenenceVVN";
import { CreateUnloadVVN } from "./use-cases/CreateUnloadVVN";
import { GetAllVVNs } from "./use-cases/GetAllVVNs";
import { GetApprovedVVNs } from "./use-cases/GetApprovedVVNs";
import { RejectVVN } from "./use-cases/RejectVVN";
import { SendBackVVN } from "./use-cases/SendBackVVN";
import { UpdateVVN } from "./use-cases/UpdateVVN";

export const CreateFullVVNUseCase = CreateFullVVN(ExternalApiVVNRepository);
export const AproveVVNUseCase = AproveVVN(ExternalApiVVNRepository);
export const CreateLoadVVNUseCase = CreateLoadVVN(ExternalApiVVNRepository);
export const CreateMaintenenceVVNUseCase = CreateMaintenenceVVN(ExternalApiVVNRepository);
export const CreateUnloadVVNUseCase = CreateUnloadVVN(ExternalApiVVNRepository);
export const GetAllVVNsUseCase = GetAllVVNs(ExternalApiVVNRepository);
export const RejectVVNUseCase = RejectVVN(ExternalApiVVNRepository);
export const SendBackVVNUseCase = SendBackVVN(ExternalApiVVNRepository);
export const UpdateVVNUseCase = UpdateVVN(ExternalApiVVNRepository);
export const GetApprovedVVNsUseCase = GetApprovedVVNs(ExternalApiVVNRepository);


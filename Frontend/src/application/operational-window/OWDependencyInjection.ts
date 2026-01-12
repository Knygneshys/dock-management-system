import { ExternalApiOWRepository } from "../../infrastructure/repositories/ExternalApiOWRepository";
import { CreateOW } from "./use-cases/CreateOW";
import { DeleteOW } from "./use-cases/DeleteOW";
import { UpdateOW } from "./use-cases/UpdateOW";

export const CreateOWUseCase = CreateOW(ExternalApiOWRepository);

export const UpdateOWUseCase = UpdateOW(ExternalApiOWRepository);

export const DeleteOWUseCase = DeleteOW(ExternalApiOWRepository);

import { ExternalApiShiftRepository } from "../../infrastructure/repositories/ExternalApiShiftRepository";
import { CreateShift } from "./use-cases/CreateShift";
import { GetAllshifts } from "./use-cases/GetAllShifts";

export const GetAllShiftsUseCase = GetAllshifts(ExternalApiShiftRepository);

export const CreateShiftUseCase = CreateShift(ExternalApiShiftRepository);
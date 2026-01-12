import { ExternalApiDockRecordRepository } from "../../infrastructure/repositories/ExternalApiDockRecordRepository";
import { CreateDockRecord } from "./use-cases/CreateDockRecord";
import { GetAllDockRecords } from "./use-cases/GetAllDockRecords";
import { GetDockRecordById } from "./use-cases/GetDockRecordById";
import { GetDockRecordBySearch } from "./use-cases/GetDockRecordBySearch";
import { UpdateDockRecord } from "./use-cases/UpdateDockRecord";

export const GetAllDockRecordsUseCase = GetAllDockRecords(ExternalApiDockRecordRepository);

export const CreateDockRecordUseCase = CreateDockRecord(ExternalApiDockRecordRepository);

export const UpdateDockRecordUseCase = UpdateDockRecord(ExternalApiDockRecordRepository);

export const GetDockRecordByIdUseCase = GetDockRecordById(ExternalApiDockRecordRepository);

export const GetDockRecordBySearchUseCase = GetDockRecordBySearch(ExternalApiDockRecordRepository);
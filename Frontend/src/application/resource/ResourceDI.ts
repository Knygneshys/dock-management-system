import { ExternalApiResourceRepository } from "../../infrastructure/repositories/ExternalApiResourceRepository";
import { CreateResource } from "./use-cases/CreateResource";
import { DeactivateResource } from "./use-cases/DeactivateResource";
import { ReactivateResource } from "./use-cases/ReactivateResource";
import { SearchResources } from "./use-cases/SearchResources";

export const SearchResourcesUseCase = SearchResources(ExternalApiResourceRepository);
export const CreateResourceUseCase = CreateResource(ExternalApiResourceRepository);
export const ReactivateResourceUseCase = ReactivateResource(ExternalApiResourceRepository);
export const DeactivateResourceUseCase = DeactivateResource(ExternalApiResourceRepository);
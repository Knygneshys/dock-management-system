import { ExternalApiIncidentRepository } from "../../infrastructure/repositories/ExternalApiIncidentRepository";
import { AssociateVVEtoIncident } from "./use-cases/AssociateVVEtoIncident";
import { CreateIncident } from "./use-cases/CreateIncident";
import { DetachVVEfromIncident } from "./use-cases/DetachVVEfromIncident";
import { ResolveIncident } from "./use-cases/ResolveIncident";
import { SearchIncidents } from "./use-cases/SearchIncidents";

export const CreateIncidentUseCase = CreateIncident(ExternalApiIncidentRepository);
export const SearchIncidentsUseCase = SearchIncidents(ExternalApiIncidentRepository);
export const AssociateVVEtoIncidentUseCase = AssociateVVEtoIncident(ExternalApiIncidentRepository);
export const DetachVVEfromIncidentUseCase = DetachVVEfromIncident(ExternalApiIncidentRepository);
export const ResolveIncidentUseCase = ResolveIncident(ExternalApiIncidentRepository);

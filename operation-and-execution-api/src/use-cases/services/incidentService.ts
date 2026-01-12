import { Inject, Service } from 'typedi';
import IIncidentService from '../IServices/IIncidentService';
import config from '../../../config';
import IIncidentRepo from '../../domain/IRepos/IIncidentRepo';
import { IncidentStatus } from '../../domain/enums/incidentStatus';
import { Result } from '../../shared/logic/Result';
import { IIncidentDTO } from '../dto/incident-dtos/IIncidentDTO';
import { GenericCode } from '../../domain/object-values/genericCode';
import { IncidentMap } from '../mappers/IncidentMap';
import { Incident } from '../../domain/entities/incident';
import { VVNCode } from '../../domain/object-values/vvnCode';
import IVVERepo from '../../domain/IRepos/IVVERepo';
import IVisitIncidentRepo from '../../domain/IRepos/IVisitIncidentRepo';
import { VisitIncident } from '../../domain/entities/visitIncident';
import { CreateIncidentCommand } from '../commands/incident/CreateIncidentCommand';
import { VVE } from '../../domain/entities/vve';
import { IIncidentTypeRepo } from '../../domain/IRepos/IIncidentTypeRepo';
import { SearchIncidentQuery } from '../queries/incident/SearchIncidentQuery';

@Service()
export default class IncidentService implements IIncidentService {
  constructor(
    @Inject(config.repos.incident.name) private incidentRepo: IIncidentRepo,
    @Inject(config.repos.vve.name) private vveRepo: IVVERepo,
    @Inject(config.repos.visitIncident.name) private visitIncidentRepo: IVisitIncidentRepo,
    @Inject(config.repos.incidentType.name) private incidentTypeRepo: IIncidentTypeRepo,
  ) {}

  public async createIncident(createIncidentCommand: CreateIncidentCommand): Promise<Result<IIncidentDTO>> {
    try {
      const incidentDTO: IIncidentDTO = {};
      //code is auto generated
      let code: GenericCode;
      do {
        const rawCode = 'INC-' + Math.floor(Math.random() * 10001);
        code = GenericCode.create(rawCode).getValue()!;
      } while (await this.incidentRepo.findByDomainId(code));

      incidentDTO.code = code.value;
      incidentDTO.status = IncidentStatus.Active;

      const incidentTypeCodeResult = GenericCode.create(createIncidentCommand.typeCode);
      if (incidentTypeCodeResult.isFailure) {
        return fail(incidentTypeCodeResult.errorValue());
      }
      const incidentType = await this.incidentTypeRepo.findByCode(incidentTypeCodeResult.getValue()!);
      if (!incidentType) {
        return fail(`Incident Type with code ${createIncidentCommand.typeCode} not found!`);
      }

      const affectedVVEs: VVE[] = [];
      for (const code of createIncidentCommand.afectedVVECodes) {
        const vveCodeResult = VVNCode.create(code);
        if (vveCodeResult.isFailure) {
          return fail(vveCodeResult.errorValue());
        }
        const vve = await this.vveRepo.findByDomainId(vveCodeResult.getValue()!);
        if (!vve) {
          return fail(`VVE with code ${code} not found!`);
        }

        affectedVVEs.push(vve);
      }

      incidentDTO.description = createIncidentCommand.description;
      incidentDTO.startISO = createIncidentCommand.startISO;
      if (createIncidentCommand.endISO) incidentDTO.endISO = createIncidentCommand.endISO;
      incidentDTO.responsibleUserEmail = createIncidentCommand.responsibleUserEmail;

      const incidentResult = IncidentMap.dtoToDomain(incidentDTO, incidentType, affectedVVEs);

      if (incidentResult.isFailure) {
        return Result.fail<IIncidentDTO>(incidentResult.errorValue());
      }
      await this.incidentRepo.save(incidentResult.getValue()!);

      const incidentDTOResult = IncidentMap.toDTO(incidentResult.getValue()!);

      return Result.ok<IIncidentDTO>(incidentDTOResult);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error searching incidents';
      return Result.fail(message);
    }
  }

  public async searchIncidents(query: SearchIncidentQuery): Promise<Result<IIncidentDTO[]>> {
    try {
      let retIncidents: Incident[];
      const filteredIncidentTypeCodes: string[] = [];
      if (query.severity) {
        const filteredIncidentTypes = await this.incidentTypeRepo.search({ severity: query.severity });
        filteredIncidentTypes.forEach((type) => {
          filteredIncidentTypeCodes.push(type.code.value);
        });
      }
      const incidents = await this.incidentRepo.search(
        query.startDate,
        query.endDate,
        query.status,
        filteredIncidentTypeCodes,
      );

      if (query.vveCode) {
        const vveCodeOrError = VVNCode.create(query.vveCode);
        if (vveCodeOrError.isFailure) {
          return Result.fail(`Failed to create ${query.vveCode} VO!`);
        }
        retIncidents = incidents.filter((i) =>
          i.afectedVVEs.find((avve) => avve.code.equals(vveCodeOrError.getValue()!)),
        );
      } else {
        retIncidents = incidents;
      }

      const incidentDTOs: IIncidentDTO[] = [];
      const errors: string[] = [];

      for (const incident of retIncidents) {
        try {
          const dto = IncidentMap.toDTO(incident) as IIncidentDTO;
          incidentDTOs.push(dto);
        } catch (mapperError) {
          errors.push(`Failed to map Incident ${incident.code.value}: ${mapperError}`);
        }
      }

      if (errors.length > 0) {
        console.warn('Some Incidents failed to map to DTO:', errors.join('; '));
      }

      return Result.ok<IIncidentDTO[]>(incidentDTOs);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error searching incidents';
      return Result.fail<IIncidentDTO[]>(message);
    }
  }

  public async associateVVEtoIncident(vveCode: number, incidentCode: string): Promise<Result<boolean>> {
    try {
      const incidentCodeOrError = GenericCode.create(incidentCode);
      if (incidentCodeOrError.isFailure) {
        return Result.fail(`Failed to create ${incidentCode} VO!`);
      }
      const vveCodeOrError = VVNCode.create(vveCode);
      if (vveCodeOrError.isFailure) {
        return Result.fail(`Failed to create ${vveCode} VO!`);
      }

      const incident = await this.incidentRepo.findByDomainId(incidentCodeOrError.getValue()!);
      if (!incident) {
        return Result.fail(`Incident with code ${incidentCode} not found!`);
      }

      const vve = await this.vveRepo.findByDomainId(vveCodeOrError.getValue()!);
      if (!vve) {
        return Result.fail(`VVE with code ${vveCode} not found!`);
      }

      //auto generate VisitIncident code
      let viCode: GenericCode;
      do {
        const rawCode = 'VI-' + Math.floor(Math.random() * 10001);
        viCode = GenericCode.create(rawCode).getValue()!;
      } while (await this.visitIncidentRepo.findByDomainId(viCode));

      const visitIncidentOrError = VisitIncident.create({
        code: viCode,
        incidentCode: incident.code,
        visitCode: vve.code,
      });
      if (visitIncidentOrError.isFailure) {
        return Result.fail<boolean>(visitIncidentOrError.errorValue());
      }

      await this.visitIncidentRepo.save(visitIncidentOrError.getValue()!);
      incident.associateVVE(vve); //to generate event

      return Result.ok<boolean>(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error associating vve';
      return Result.fail<boolean>(message);
    }
  }

  public async detachVVEfromIncident(vveCode: number, incidentCode: string): Promise<Result<boolean>> {
    try {
      const incidentCodeOrError = GenericCode.create(incidentCode);
      if (incidentCodeOrError.isFailure) {
        return Result.fail(`Failed to create ${incidentCode} VO!`);
      }
      const vveCodeOrError = VVNCode.create(vveCode);
      if (vveCodeOrError.isFailure) {
        return Result.fail(`Failed to create ${vveCode} VO!`);
      }

      const incident = await this.incidentRepo.findByDomainId(incidentCodeOrError.getValue()!);
      if (!incident) {
        return Result.fail(`Incident with code ${incidentCode} not found!`);
      }

      const vve = await this.vveRepo.findByDomainId(vveCodeOrError.getValue()!);
      if (!vve) {
        return Result.fail(`VVE with code ${vveCode} not found!`);
      }

      const affectedVisit = incident.afectedVVEs.find((afectedVve) => afectedVve.equals(vve));
      if (!affectedVisit) {
        return Result.fail(`Incident with code ${incidentCode} does not contain vve ${vveCode}`);
      }

      const visitIncident = await this.visitIncidentRepo.search(
        vveCodeOrError.getValue(),
        incidentCodeOrError.getValue(),
      );
      await this.visitIncidentRepo.deleteByDomainCode(visitIncident[0]!.code!);
      incident.detachVVE(vve); //to generate event

      return Result.ok<boolean>(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error detaching vve';
      return Result.fail<boolean>(message);
    }
  }

  public async resolveIncident(incidentCode: string): Promise<Result<IIncidentDTO>> {
    try {
      const incidentCodeOrError = GenericCode.create(incidentCode);
      if (incidentCodeOrError.isFailure) {
        return Result.fail(`Failed to create ${incidentCode} VO!`);
      }

      const incident = await this.incidentRepo.findByDomainId(incidentCodeOrError.getValue()!);
      if (!incident) {
        return Result.fail(`Incident with code ${incidentCode} not found!`);
      }

      const resolveOrFail = incident.resolve();
      if (resolveOrFail.isFailure) {
        return Result.fail(resolveOrFail.errorValue());
      }

      const savedIncident = await this.incidentRepo.save(incident);
      const incidentDTO = IncidentMap.toDTO(savedIncident);

      return Result.ok<IIncidentDTO>(incidentDTO);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error resolving incident';
      return Result.fail<IIncidentDTO>(message);
    }
  }
}

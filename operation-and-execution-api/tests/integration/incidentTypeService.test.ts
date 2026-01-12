/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import { Container } from 'typedi';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from '../../config';
import { IncidentTypeProvider } from '../providers/IncidentTypeProvider';
import IIncidentTypeService from '@src/use-cases/IServices/IIncidentTypeService';
import { IIncidentTypeRepo } from '@src/domain/IRepos/IIncidentTypeRepo';
import { GenericCode } from '../../src/domain/object-values/genericCode';
import { IncidentType } from '@src/domain/entities/incidentType';
import { SeverityClassification } from '@src/domain/enums/severityClassification';
import { SearchIncidentTypeQuery } from '@src/use-cases/queries/incident-type/SearchIncidentTypeQuery';

describe('IncidentTypeService + Repository - Integration Tests', function () {
  let mongoServer: MongoMemoryServer;

  before(async function () {
    this.timeout(60000);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async function () {
    Container.reset();

    // Setup schema
    const incidentTypeSchema = (await import('../../src/infrastructure/mongodb/persistence/schemas/IncidentTypeSchema'))
      .default;
    Container.set('IncidentTypeSchema', incidentTypeSchema);

    // Setup repository
    const IncidentTypeRepository = (await import('../../src/infrastructure/mongodb/repos/IncidentTypeRepo')).default;
    const incidentTypeRepositoryInstance = Container.get(IncidentTypeRepository);
    Container.set(config.repos.incidentType.name, incidentTypeRepositoryInstance);

    // Setup service
    const IncidentTypeService = (await import('../../src/use-cases/services/incidentTypeService')).default;
    const incidentTypeServiceInstance = Container.get(IncidentTypeService);
    Container.set(config.services.incidentType.name, incidentTypeServiceInstance);
  });

  afterEach(async function () {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  describe('create', function () {
    it('should create incident type and persist in database', async function () {
      // Arrange
      const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();

      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const repository = Container.get<IIncidentTypeRepo>(config.repos.incidentType.name);

      // Act
      const result = await service.create(command);

      // Assert
      const createdIncidentTypeCode = result.getValue()!;
      expect(result.isSuccess).to.be.true;
      expect(createdIncidentTypeCode).to.not.be.undefined;
      expect(createdIncidentTypeCode).to.equal(command.code);

      const codeResult = GenericCode.create(createdIncidentTypeCode);
      const persistedIncidentType = await repository.findByCode(codeResult.getValue()!);
      expect(persistedIncidentType).to.not.be.null;
      expect(persistedIncidentType!.code.value).to.equal(command.code);
      expect(persistedIncidentType!.description).to.equal(command.description);
    });

    it('should fail to create an incident type when the parent code does not exist', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const repository = Container.get<IIncidentTypeRepo>(config.repos.incidentType.name);

      const command = IncidentTypeProvider.provideCreateIncidentTypeCommandWithParent();

      // Act
      const result = await service.create(command);

      // Assert
      expect(result.isFailure).to.be.true;

      const codeResult = GenericCode.create('SUB-INC-001');
      const persistedIncidentType = await repository.findByCode(codeResult.getValue()!);

      expect(persistedIncidentType).to.be.null;
    });
  });

  describe('update method', function () {
    it('should successfully update an existing IncidentType', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const repository = Container.get<IIncidentTypeRepo>(config.repos.incidentType.name);

      const initialCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      await service.create(initialCommand);

      const updateCommand = IncidentTypeProvider.provideUpdateIncidentTypeCommand();

      // Act
      const result = await service.update(initialCommand.code, updateCommand);

      // Assert
      expect(result.isSuccess).to.be.true;

      const codeResult = GenericCode.create(initialCommand.code);
      const persisted = await repository.findByCode(codeResult.getValue()!);

      expect(persisted!.name).to.equal(updateCommand.name);
      expect(persisted!.severity).to.equal(updateCommand.severity);
    });

    it('should fail to update an IncidentType when the parent code does not exist', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const repository = Container.get<IIncidentTypeRepo>(config.repos.incidentType.name);

      const initialCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      await service.create(initialCommand);

      const updateCommand = IncidentTypeProvider.provideUpdateIncidentTypeCommandWithParent();

      // Act
      const result = await service.update(initialCommand.code, updateCommand);

      // Assert
      expect(result.isFailure).to.be.true;

      const codeResult = GenericCode.create(initialCommand.code);
      const persisted = await repository.findByCode(codeResult.getValue()!);

      expect(persisted!.parentIncidentTypeCode).to.not.equal(updateCommand.parentIncidentTypeCode);
    });

    it('should successfully update the parentIncidentTypeCode when the parent exists', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const repository = Container.get<IIncidentTypeRepo>(config.repos.incidentType.name);

      const parentCode = 'PARENT-999';
      const childCode = 'CHILD-888';
      const updatedName = 'Updated with Parent';

      const parentCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      parentCommand.code = parentCode;
      await service.create(parentCommand);

      const childCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      childCommand.code = childCode;
      await service.create(childCommand);

      const updateCommand = IncidentTypeProvider.provideUpdateIncidentTypeCommandWithParent();
      updateCommand.parentIncidentTypeCode = parentCode;
      updateCommand.name = updatedName;

      // Act
      const result = await service.update(childCode, updateCommand);

      // Assert
      expect(result.isSuccess).to.be.true;

      const codeResult = GenericCode.create(childCode);
      const persisted = await repository.findByCode(codeResult.getValue()!);

      expect(persisted).to.not.be.null;
      expect(persisted!.parentIncidentTypeCode).to.equal(parentCode);
      expect(persisted!.name).to.equal(updatedName);
    });
  });

  describe('getAll', function () {
    it('should successfully return all existing incident types', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);

      const code1 = 'INC-001';
      const code2 = 'INC-002';

      const command1 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command1.code = code1;
      await service.create(command1);

      const command2 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command2.code = code2;
      await service.create(command2);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result.isSuccess).to.be.true;

      const incidentTypes = result.getValue();
      expect(incidentTypes).to.be.an('array');
      expect(incidentTypes!.length).to.equal(2);

      // Verify the data belongs to the entities created
      const codes = incidentTypes!.map((it) => it.code.value);
      expect(codes).to.include(code1);
      expect(codes).to.include(code2);
    });

    it('should return an empty array when no incident types exist', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result.isSuccess).to.be.true;

      const incidentTypes = result.getValue();
      expect(incidentTypes).to.be.an('array');
      expect(incidentTypes!.length).to.equal(0);
    });
  });

  describe('getByCode', function () {
    it('should successfully return the specific incident type when it exists', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const targetCode = 'INC-MATCH';
      const createdIncidentTypeName = 'Target Incident Type';

      const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command.code = targetCode;
      command.name = createdIncidentTypeName;
      await service.create(command);

      // Act
      const result = await service.getByCode(targetCode);

      // Assert
      expect(result.isSuccess).to.be.true;

      const incidentType = result.getValue()! as IncidentType;
      expect(incidentType).to.not.be.undefined;
      expect(incidentType.code.value).to.equal(targetCode);
      expect(incidentType.name).to.equal(createdIncidentTypeName);
    });

    it('should return a failure error when the specified code does not exist even if other types exist', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);

      const existingCode1 = 'INC-001';
      const existingCode2 = 'INC-002';
      const nonExistentCode = 'INC-UNKNOWN';

      const command1 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command1.code = existingCode1;
      await service.create(command1);

      const command2 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command2.code = existingCode2;
      await service.create(command2);

      // Act
      const result = await service.getByCode(nonExistentCode);

      // Assert
      expect(result.isFailure).to.be.true;

      const error = result.errorValue();
      expect(error).to.not.be.undefined;
    });
  });

  describe('search', function () {
    it('should return only the 2 incident types that have the Major severity classification out of 5 existing records', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);

      const severities = [
        SeverityClassification.Major,
        SeverityClassification.Major,
        SeverityClassification.Minor,
        SeverityClassification.Critical,
        SeverityClassification.Medium,
      ];

      for (let i = 0; i < severities.length; i++) {
        const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
        command.code = `INC-00${i}`;
        command.severity = severities[i]!;
        await service.create(command);
      }

      const query: SearchIncidentTypeQuery = { severity: SeverityClassification.Major };

      // Act
      const result = await service.search(query);

      // Assert
      expect(result.isSuccess).to.be.true;
      const found = result.getValue() as IncidentType[];
      expect(found.length).to.equal(2);
      found.forEach((it) => {
        expect(it.severity).to.equal(SeverityClassification.Major);
      });
    });

    it('should return an empty array when none of the 3 existing types match the filter', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);
      const description = 'Non-existent description';

      for (let i = 1; i <= 3; i++) {
        const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
        command.code = `EXISTING-${i}`;
        command.description = 'Normal operation';
        await service.create(command);
      }

      const query: SearchIncidentTypeQuery = { description: description };

      // Act
      const result = await service.search(query);

      // Assert
      expect(result.isSuccess).to.be.true;
      const found = result.getValue() as IncidentType[];
      expect(found.length).to.equal(0);
    });

    it('should return all 3 existing incident types when the query is empty', async function () {
      // Arrange
      const service = Container.get<IIncidentTypeService>(config.services.incidentType.name);

      for (let i = 1; i <= 3; i++) {
        const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
        command.code = `ALL-${i}`;
        await service.create(command);
      }

      const emptyQuery: SearchIncidentTypeQuery = {};

      // Act
      const result = await service.search(emptyQuery);

      // Assert
      expect(result.isSuccess).to.be.true;
      const found = result.getValue() as IncidentType[];
      expect(found.length).to.equal(3);
    });
  });
});

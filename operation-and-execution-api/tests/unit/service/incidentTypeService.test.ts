/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import { IIncidentTypeRepo } from '../../../src/domain/IRepos/IIncidentTypeRepo';
import { IncidentType } from '../../../src/domain/entities/incidentType';
import { GenericCode } from '../../../src/domain/object-values/genericCode';
import { SeverityClassification } from '../../../src/domain/enums/severityClassification';
import { CreateIncidentTypeCommand } from '../../../src/use-cases/commands/incident-type/CreateIncidentTypeCommand';
import IncidentTypeService from '@src/use-cases/services/incidentTypeService';
import { Result } from '@src/shared/logic/Result';
import { UpdateIncidentTypeCommand } from '@src/use-cases/commands/incident-type/UpdateIncidentTypeCommand';
import { IncidentTypeProvider } from '../../providers/IncidentTypeProvider';

describe('IncidentTypeService - Unit Tests', function () {
  let repoStub: sinon.SinonStubbedInstance<IIncidentTypeRepo>;
  let service: IncidentTypeService;

  beforeEach(function () {
    repoStub = {
      findByCode: sinon.stub(),
      save: sinon.stub(),
      getAll: sinon.stub(),
      exists: sinon.stub(),
      search: sinon.stub(),
    } as sinon.SinonStubbedInstance<IIncidentTypeRepo>;

    service = new IncidentTypeService(repoStub);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('create', () => {
    it('should successfully create an incident type', async function () {
      // Arrange
      const command: CreateIncidentTypeCommand = {
        code: 'INC-001',
        name: 'Fire',
        description: 'Fire hazard',
        severity: SeverityClassification.Critical,
        parentIncidentTypeCode: null,
      };

      const domainEntity = IncidentType.create({
        code: GenericCode.create(command.code).getValue()!,
        name: command.name,
        description: command.description,
        severity: command.severity,
        parentIncidentTypeCode: null,
      }).getValue()!;

      repoStub.findByCode.resolves(null);
      repoStub.save.resolves(domainEntity);

      // Act
      const result = await service.create(command);

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal('INC-001');
      expect(repoStub.save.calledOnce).to.be.true;
    });

    it('should fail if the incident type code already exists', async function () {
      // Arrange
      const command: CreateIncidentTypeCommand = {
        code: 'DUP-001',
        name: 'Duplicate',
        description: 'Testing duplicates',
        severity: SeverityClassification.Medium,
        parentIncidentTypeCode: null,
      };

      repoStub.findByCode.resolves({} as IncidentType);

      // Act
      const result = await service.create(command);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('already exists');
      expect(repoStub.save.called).to.be.false;
    });

    it('should fail if the parent incident type does not exist', async function () {
      // Arrange
      const command: CreateIncidentTypeCommand = {
        code: 'CHILD-01',
        name: 'Child',
        description: 'Testing missing parent',
        severity: SeverityClassification.Minor,
        parentIncidentTypeCode: 'NON-EXISTENT',
      };

      repoStub.findByCode.withArgs(sinon.match.any).onFirstCall().resolves(null);
      repoStub.findByCode.withArgs(sinon.match.any).onSecondCall().resolves(null);

      // Act
      const result = await service.create(command);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('parent');
      expect(result.error).to.contain('does not exist');
      expect(repoStub.save.called).to.be.false;
    });
  });

  describe('getAll', () => {
    it('should return all incident types from the repository', async function () {
      // Arrange
      const mockList = [{} as IncidentType, {} as IncidentType];
      repoStub.getAll.resolves(mockList);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.lengthOf(2);
      expect(repoStub.getAll.calledOnce).to.be.true;
    });
  });

  describe('getByCode', () => {
    it('should return the incident type when it exists', async function () {
      // Arrange
      const code = 'INC-001';
      const mockEntity = {} as IncidentType;
      repoStub.findByCode.resolves(mockEntity);

      // Act
      const result = await service.getByCode(code);

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(mockEntity);
      expect(repoStub.findByCode.calledWith(sinon.match.has('value', code))).to.be.true;
    });

    it('should fail when the incident type does not exist', async function () {
      // Arrange
      repoStub.findByCode.resolves(null);

      // Act
      const result = await service.getByCode('MISSING');

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('does not exist');
    });
  });

  describe('search', () => {
    it('should return search results from the repository', async function () {
      // Arrange
      const query = { severity: SeverityClassification.Major };
      const mockResults = [{} as IncidentType];
      repoStub.search.resolves(mockResults);

      // Act
      const result = await service.search(query);

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(mockResults);
      expect(repoStub.search.calledWith(query)).to.be.true;
    });
  });

  describe('update', () => {
    let existingEntity: IncidentType;

    beforeEach(() => {
      existingEntity = IncidentType.create({
        code: GenericCode.create('ORIGINAL').getValue()!,
        name: 'Old Name',
        description: 'Old Desc',
        severity: SeverityClassification.Minor,
        parentIncidentTypeCode: null,
      }).getValue()!;

      sinon.stub(existingEntity, 'update').returns(Result.ok<string>());
    });

    it('should successfully update the incident type', async function () {
      // Arrange
      const command: UpdateIncidentTypeCommand = {
        name: 'New Name',
        description: 'New Desc',
        severity: SeverityClassification.Major,
        parentIncidentTypeCode: null,
      };

      repoStub.findByCode.resolves(existingEntity);
      repoStub.save.resolves(existingEntity);

      // Act
      const result = await service.update('ORIGINAL', command);

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(repoStub.save.calledOnce).to.be.true;
    });

    it('should fail if the target incident type does not exist', async function () {
      // Arrange
      const command = IncidentTypeProvider.provideUpdateIncidentTypeCommand();
      repoStub.findByCode.resolves(null);

      // Act
      const result = await service.update('UNKNOWN', command);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('does not exist');
    });

    it('should fail if parent code is the same as the incident type code', async function () {
      // Arrange
      const code = 'INC-001';
      const command: UpdateIncidentTypeCommand = {
        name: 'Self Parent',
        description: 'Testing recursion',
        severity: SeverityClassification.Minor,
        parentIncidentTypeCode: code,
      };

      repoStub.findByCode.resolves(existingEntity);

      // Act
      const result = await service.update(code, command);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('parent code is the same');
    });

    it('should fail if the new parent does not exist', async function () {
      // Arrange
      const command: UpdateIncidentTypeCommand = {
        name: 'New Name',
        description: 'Desc',
        severity: SeverityClassification.Minor,
        parentIncidentTypeCode: 'PARENT-MISSING',
      };

      repoStub.findByCode.onFirstCall().resolves(existingEntity);
      repoStub.findByCode.onSecondCall().resolves(null);

      // Act
      const result = await service.update('ORIGINAL', command);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(result.error).to.contain('parent');
      expect(result.error).to.contain('does not exist');
    });
  });
});

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { IncidentType } from '../../../src/domain/entities/incidentType';
import { SeverityClassification } from '../../../src/domain/enums/severityClassification';
import { CreateIncidentTypeCommand } from '../../../src/use-cases/commands/incident-type/CreateIncidentTypeCommand';
import { IncidentTypeMapper } from '@src/use-cases/mappers/IncidentTypeMapper';
import { IIncidentTypePersistence } from '@src/use-cases/dataschema/IIncidentTypePersistence';
import { IncidentTypeProvider } from '../../providers/IncidentTypeProvider';

describe('IncidentTypeMapper - Unit Tests', function () {
  describe('toPersistence', function () {
    it('should map a domain entity to a persistence object', function () {
      // Arrange
      const incidentType = IncidentTypeProvider.provideIncidentType();

      // Act
      const result = IncidentTypeMapper.toPersistence(incidentType);

      // Assert
      expect(result.code).to.equal('INC001');
      expect(result.name).to.equal('Hardware Failure');
      expect(result.description).to.equal('Server rack power loss');
      expect(result.severity).to.equal(SeverityClassification.Critical);
      expect(result.parentIncidentTypeCode).to.equal('PARENT01');
    });
  });

  describe('toDto', function () {
    it('should map a domain entity to a DTO', function () {
      // Arrange
      const incidentType = IncidentTypeProvider.provideIncidentType();

      // Act
      const result = IncidentTypeMapper.toDto(incidentType);

      // Assert
      expect(result.code).to.equal('INC001');
      expect(result.name).to.equal('Hardware Failure');
      expect(result.severity).to.equal(SeverityClassification.Critical);
      expect(result.parentIncidentTypeCode).to.equal('PARENT01');
    });

    it('should not include parentIncidentTypeCode in DTO if it is null', function () {
      // Arrange
      const incidentType = IncidentTypeProvider.provideIncidentTypeWithoutParent();
      // Act
      const result = IncidentTypeMapper.toDto(incidentType);

      // Assert
      expect(result).to.not.have.property('parentIncidentTypeCode');
    });
  });

  describe('toDomain', function () {
    it('should map a persistence object back to a domain entity', async function () {
      // Arrange
      const persistence: IIncidentTypePersistence = {
        code: 'INC001',
        name: 'Database Leak',
        description: 'Memory leak in DB',
        severity: SeverityClassification.Major,
        parentIncidentTypeCode: null,
      };

      // Act
      const result = await IncidentTypeMapper.toDomain(persistence);

      // Assert
      expect(result).to.be.instanceOf(IncidentType);
      expect(result.code.value).to.equal('INC001');
      expect(result.name).to.equal('Database Leak');
      expect(result.severity).to.equal(SeverityClassification.Major);
      expect(result.parentIncidentTypeCode).to.be.null;
    });
  });

  describe('mapCreateIncidentTypeCommandToOperationPlan', function () {
    it('should map a CreateCommand to a domain entity', function () {
      // Arrange
      const command: CreateIncidentTypeCommand = {
        code: 'CMD001',
        name: 'Command Name',
        description: 'Command Desc',
        severity: SeverityClassification.Medium,
        parentIncidentTypeCode: 'PARENT99',
      };

      // Act
      const result = IncidentTypeMapper.mapCreateIncidentTypeCommandToOperationPlan(command);

      // Assert
      expect(result).to.be.instanceOf(IncidentType);
      expect(result.code.value).to.equal('CMD001');
      expect(result.name).to.equal('Command Name');
      expect(result.parentIncidentTypeCode).to.equal('PARENT99');
    });
  });
});

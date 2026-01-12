/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { IncidentType } from '../../../src/domain/entities/incidentType';
import { GenericCode } from '../../../src/domain/object-values/genericCode';
import { SeverityClassification } from '../../../src/domain/enums/severityClassification';
import { UpdateIncidentTypeCommand } from '@src/use-cases/commands/incident-type/UpdateIncidentTypeCommand';
import { UniqueEntityID } from '@src/shared/domain/UniqueEntityID';

describe('Incident Type Entity - Unit Tests', function () {
  describe('create method', function () {
    it('should successfully create an IncidentType with all valid required properties', function () {
      // Arrange
      const codeOrError = GenericCode.create('INC001');
      const code = codeOrError.getValue();

      // Act
      const incidentTypeOrError = IncidentType.create({
        code: code!,
        name: 'Equipment Failure',
        description: 'Equipment has failed during operation',
        severity: SeverityClassification.Major,
        parentIncidentTypeCode: null,
      });

      // Assert
      const incidentType = incidentTypeOrError.getValue();
      expect(codeOrError.isSuccess).to.be.true;
      expect(incidentTypeOrError.isSuccess).to.be.true;
      expect(incidentType!.code.value).to.equal('INC001');
      expect(incidentType!.name).to.equal('Equipment Failure');
      expect(incidentType!.description).to.equal('Equipment has failed during operation');
      expect(incidentType!.severity).to.equal(SeverityClassification.Major);
      expect(incidentType!.parentIncidentTypeCode).to.be.null;
    });

    it('should successfully create an IncidentType with a parent incident type code', function () {
      // Arrange
      const codeOrError = GenericCode.create('INC002');
      const code = codeOrError.getValue();

      // Act
      const incidentTypeOrError = IncidentType.create({
        code: code!,
        name: 'Crane Malfunction',
        description: 'Crane has malfunctioned',
        severity: SeverityClassification.Critical,
        parentIncidentTypeCode: 'INC001',
      });

      // Assert
      const incidentType = incidentTypeOrError.getValue();
      expect(codeOrError.isSuccess).to.be.true;
      expect(incidentTypeOrError.isSuccess).to.be.true;
      expect(incidentType!.parentIncidentTypeCode).to.equal('INC001');
    });

    it('should successfully create an IncidentType with a specific ID', function () {
      // Arrange
      const codeOrError = GenericCode.create('INC003');
      const code = codeOrError.getValue();
      const customId = new UniqueEntityID('custom-id-123');

      // Act
      const incidentTypeOrError = IncidentType.create(
        {
          code: code!,
          name: 'Safety Violation',
          description: 'Safety protocol has been violated',
          severity: SeverityClassification.Medium,
          parentIncidentTypeCode: null,
        },
        customId,
      );

      // Assert
      const incidentType = incidentTypeOrError.getValue();
      expect(codeOrError.isSuccess).to.be.true;
      expect(incidentTypeOrError.isSuccess).to.be.true;
      expect(incidentType!.id.toString()).to.equal('custom-id-123');
    });
  });

  describe('update method', function () {
    it('should successfully update all properties of an IncidentType', function () {
      // Arrange
      const codeOrError = GenericCode.create('INC015');
      const code = codeOrError.getValue();

      const incidentTypeOrError = IncidentType.create({
        code: code!,
        name: 'Original Name',
        description: 'Original Description',
        severity: SeverityClassification.Minor,
        parentIncidentTypeCode: null,
      });

      const incidentType = incidentTypeOrError.getValue();

      const updateCommand: UpdateIncidentTypeCommand = {
        name: 'Updated Name',
        description: 'Updated Description',
        severity: SeverityClassification.Critical,
        parentIncidentTypeCode: 'INC001',
      };

      // Act
      const updateResult = incidentType!.update(updateCommand);

      // Assert
      expect(codeOrError.isSuccess).to.be.true;
      expect(incidentTypeOrError.isSuccess).to.be.true;
      expect(updateResult.isSuccess).to.be.true;
      expect(incidentType!.name).to.equal('Updated Name');
      expect(incidentType!.description).to.equal('Updated Description');
      expect(incidentType!.severity).to.equal(SeverityClassification.Critical);
      expect(incidentType!.parentIncidentTypeCode).to.equal('INC001');
    });
  });
});

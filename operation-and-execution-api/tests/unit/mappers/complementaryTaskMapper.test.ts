/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import { ICompTaskDTO } from '../../../src/use-cases/dto/ICompTaskDTO';
import { compTaskStatus } from '../../../src/domain/enums/compTaskStatus';
import { CompTaskMap } from '../../../src/use-cases/mappers/CompTaskMap';
import { ICompTaskPersistence } from '../../../src/use-cases/dataschema/ICompTaskPersistence';

describe('ComplementaryTaskMapper - Unit Tests', function () {
  it('should map DTO to domain props successfully', function () {
    // Arrange
    const dto: ICompTaskDTO = {
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    // Act
    const result = CompTaskMap.toDomainProps(dto);

    // Assert
    expect(result.isSuccess).to.be.true;
    const props = result.getValue()!;
    expect(props.code.value).to.equal('CT-001');
    expect(props.vveCode.value).to.equal(1001);
    expect(props.team).to.equal('Team A');
  });

  it('should fail when required fields are missing', function () {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invalidDto: any = {
      code: 'CT-001',
      vveCode: 1001,
      // missing categoryCode, team, start, status, impactOnOperations
    };

    // Act
    const result = CompTaskMap.toDomainProps(invalidDto);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.include('Missing required fields');
  });

  it('should fail with invalid status', function () {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dto: any = {
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: 'INVALID_STATUS',
      impactOnOperations: true,
    };

    // Act
    const result = CompTaskMap.toDomainProps(dto);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.include('Invalid ComplementaryTask status');
  });

  it('should map persistence to domain entity successfully', function () {
    // Arrange
    const persistence: ICompTaskPersistence = {
      id: 'some-uuid-123',
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    // Act
    const result = CompTaskMap.toDomain(persistence);

    // Assert
    expect(result.isSuccess).to.be.true;
    const task = result.getValue();
    expect(task).to.not.be.undefined;
    expect(task!.code.value).to.equal('CT-001');
    expect(task!.team).to.equal('Team A');
  });

  it('should map domain entity to DTO successfully', function () {
    // Arrange
    const persistence: ICompTaskPersistence = {
      id: 'some-uuid-123',
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    const taskResult = CompTaskMap.toDomain(persistence);
    const task = taskResult.getValue()!;

    // Act
    const dto = CompTaskMap.toDTO(task);

    // Assert
    expect(dto.code).to.equal('CT-001');
    expect(dto.vveCode).to.equal(1001);
    expect(dto.team).to.equal('Team A');
    expect(dto.status).to.equal(compTaskStatus.Scheduled);
  });

  it('should map domain entity to persistence successfully', function () {
    // Arrange
    const persistence: ICompTaskPersistence = {
      id: 'some-uuid-123',
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    const taskResult = CompTaskMap.toDomain(persistence);
    const task = taskResult.getValue()!;

    // Act
    const persistenceResult = CompTaskMap.toPersistence(task);

    // Assert
    expect(persistenceResult.code).to.equal('CT-001');
    expect(persistenceResult.vveCode).to.equal(1001);
    expect(persistenceResult.team).to.equal('Team A');
  });

  it('should handle optional end date in DTO', function () {
    // Arrange
    const dto: ICompTaskDTO = {
      code: 'CT-001',
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: new Date('2025-12-30T15:00:00Z'),
      status: compTaskStatus.Completed,
      impactOnOperations: true,
    };

    // Act
    const result = CompTaskMap.toDomainProps(dto);

    // Assert
    expect(result.isSuccess).to.be.true;
    const props = result.getValue()!;
    expect(props.end).to.not.be.undefined;
  });

  it('should map update DTO to update props successfully', function () {
    // Arrange
    const updateDto = {
      status: compTaskStatus.Completed,
      end: new Date('2025-12-30T15:00:00Z'),
    };

    // Act
    const result = CompTaskMap.toUpdateProps(updateDto);

    // Assert
    expect(result.isSuccess).to.be.true;
    const props = result.getValue()!;
    expect(props.status).to.equal(compTaskStatus.Completed);
    expect(props.end).to.not.be.undefined;
  });
});

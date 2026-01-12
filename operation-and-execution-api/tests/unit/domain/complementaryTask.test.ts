/* eslint-disable @typescript-eslint/no-unused-expressions */
// tests/unit/domain/complementaryTask.test.ts
import 'reflect-metadata';
import { expect } from 'chai';
import { GenericCode } from '../../../src/domain/object-values/genericCode';
import { VVNCode } from '../../../src/domain/object-values/vvnCode';
import { compTaskStatus } from '../../../src/domain/enums/compTaskStatus';
import { ComplementaryTask } from '../../../src/domain/entities/ComplementaryTask';

describe('ComplementaryTask Entity - Unit Tests', function () {
  it('should create a valid complementary task', function () {
    // Arrange
    const taskData = {
      code: GenericCode.create('CT-001').getValue()!,
      vveCode: VVNCode.create(1001).getValue()!,
      categoryCode: GenericCode.create('CAT-001').getValue()!,
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: undefined,
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    // Act
    const result = ComplementaryTask.create(taskData);

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()!.code.value).to.equal('CT-001');
    expect(result.getValue()!.vveCode.value).to.equal(1001);
    expect(result.getValue()!.team).to.equal('Team A');
    expect(result.getValue()!.status).to.equal(compTaskStatus.Scheduled);
  });

  it('should fail when end date is before start date', function () {
    // Arrange
    const taskData = {
      code: GenericCode.create('CT-001').getValue()!,
      vveCode: VVNCode.create(1001).getValue()!,
      categoryCode: GenericCode.create('CAT-001').getValue()!,
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: new Date('2025-12-25T10:00:00Z'),
      status: compTaskStatus.Completed,
      impactOnOperations: true,
    };

    // Act
    const result = ComplementaryTask.create(taskData);

    // Assert
    expect(result.isFailure).to.be.true;
  });

  it('should fail when status is completed but no end date provided', function () {
    // Arrange
    const taskData = {
      code: GenericCode.create('CT-001').getValue()!,
      vveCode: VVNCode.create(1001).getValue()!,
      categoryCode: GenericCode.create('CAT-001').getValue()!,
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: undefined, // No end date
      status: compTaskStatus.Completed,
      impactOnOperations: true,
    };

    // Act
    const result = ComplementaryTask.create(taskData);

    // Assert
    expect(result.isFailure).to.be.true;
  });

  it('should create task with end date when status is completed', function () {
    // Arrange
    const taskData = {
      code: GenericCode.create('CT-001').getValue()!,
      vveCode: VVNCode.create(1001).getValue()!,
      categoryCode: GenericCode.create('CAT-001').getValue()!,
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: new Date('2025-12-30T15:00:00Z'),
      status: compTaskStatus.Completed,
      impactOnOperations: true,
    };

    // Act
    const result = ComplementaryTask.create(taskData);

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()!.status).to.equal(compTaskStatus.Completed);
    expect(result.getValue()!.end).to.not.be.undefined;
  });

  it('should create task without end date when status is pending', function () {
    // Arrange
    const taskData = {
      code: GenericCode.create('CT-001').getValue()!,
      vveCode: VVNCode.create(1001).getValue()!,
      categoryCode: GenericCode.create('CAT-001').getValue()!,
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      end: undefined,
      status: compTaskStatus.Scheduled,
      impactOnOperations: false,
    };

    // Act
    const result = ComplementaryTask.create(taskData);

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()!.end).to.be.undefined;
  });
});

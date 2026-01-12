/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import { GenericCode } from '../../../src/domain/object-values/genericCode';
import { Time } from '../../../src/domain/object-values/time';
import { ComplementaryTaskCategory } from '@src/domain/entities/complementaryTaskCategory';

describe('ComplementaryTaskCategory Entity - Unit Tests', function () {
  it('should create a valid complementary task category with default delay', function () {
    // Arrange
    const categoryData = {
      code: GenericCode.create('CTC-001').getValue()!,
      name: 'Maintenance',
      description: 'Maintenance related complementary tasks',
      defaultDelay: Time.create({ hour: 30, minute: 0 }).getValue()!,
    };

    // Act
    const result = ComplementaryTaskCategory.create(categoryData);

    // Assert
    expect(result.isSuccess).to.be.true;
    const category = result.getValue()!;
    expect(category.code.value).to.equal('CTC-001');
    expect(category.name).to.equal('Maintenance');
    expect(category.description).to.equal('Maintenance related complementary tasks');
    expect(category.defaultDelay).to.not.be.undefined;
  });

  it('should create a valid complementary task category without default delay', function () {
    // Arrange
    const categoryData = {
      code: GenericCode.create('CTC-002').getValue()!,
      name: 'Inspection',
      description: 'Inspection related complementary tasks',
      defaultDelay: undefined,
    };

    // Act
    const result = ComplementaryTaskCategory.create(categoryData);

    // Assert
    expect(result.isSuccess).to.be.true;
    const category = result.getValue()!;
    expect(category.defaultDelay).to.be.undefined;
  });

  it('should fail when code is null', function () {
    // Arrange
    const categoryData = {
      code: null as unknown as GenericCode,
      name: 'Maintenance',
      description: 'Maintenance related complementary tasks',
      defaultDelay: undefined,
    };

    // Act
    const result = ComplementaryTaskCategory.create(categoryData);

    // Assert
    expect(result.isFailure).to.be.true;
  });

  it('should fail when name is null', function () {
    // Arrange
    const categoryData = {
      code: GenericCode.create('CTC-003').getValue()!,
      name: null as unknown as string,
      description: 'Maintenance related complementary tasks',
      defaultDelay: undefined,
    };

    // Act
    const result = ComplementaryTaskCategory.create(categoryData);

    // Assert
    expect(result.isFailure).to.be.true;
  });

  it('should fail when description is undefined', function () {
    // Arrange
    const categoryData = {
      code: GenericCode.create('CTC-004').getValue()!,
      name: 'Maintenance',
      description: undefined as unknown as string,
      defaultDelay: undefined,
    };

    // Act
    const result = ComplementaryTaskCategory.create(categoryData);

    // Assert
    expect(result.isFailure).to.be.true;
  });
});

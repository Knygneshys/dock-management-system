/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import CompTaskCategoryService from '../../../src/use-cases/services/compTaskCategoryService';
import ICompTaskCategoryRepo from '../../../src/domain/IRepos/ICompTaskCategoryRepo';
import { ICompTaskCategoryDTO } from '../../../src/use-cases/dto/ICompTaskCategoryDTO';
import { ComplementaryTaskCategory } from '../../../src/domain/entities/complementaryTaskCategory';
import { GenericCode } from '../../../src/domain/object-values/genericCode';
import { Time } from '../../../src/domain/object-values/time';

describe('CompTaskCategoryService - Unit Tests', function () {
  let repoStub: sinon.SinonStubbedInstance<ICompTaskCategoryRepo>;
  let service: CompTaskCategoryService;

  beforeEach(function () {
    repoStub = {
      findByDomainId: sinon.stub(),
      save: sinon.stub(),
      search: sinon.stub(),
    } as sinon.SinonStubbedInstance<ICompTaskCategoryRepo>;

    service = new CompTaskCategoryService(repoStub);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async function () {
      // Arrange
      repoStub.findByDomainId.resolves(null);
      repoStub.save.resolves();

      const dto: ICompTaskCategoryDTO = {
        name: 'Maintenance',
        description: 'Maintenance tasks',
        defaultDelay: { hour: 1, minute: 30 },
      };

      // Act
      const result = await service.createCategory(dto);

      // Assert
      expect(result.isSuccess).to.be.true;
      const created = result.getValue()!;
      expect(created.code).to.exist;
      expect(created.name).to.equal('Maintenance');
      expect(repoStub.save.calledOnce).to.be.true;
    });

    it('should retry code generation if code already exists', async function () {
      // Arrange
      repoStub.findByDomainId
        .onFirstCall()
        .resolves({} as ComplementaryTaskCategory) // code collision
        .onSecondCall()
        .resolves(null);

      repoStub.save.resolves();

      const dto: ICompTaskCategoryDTO = {
        name: 'Inspection',
        description: 'Inspection tasks',
      };

      // Act
      const result = await service.createCategory(dto);

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(repoStub.findByDomainId.calledTwice).to.be.true;
    });

    it('should fail when mapper fails', async function () {
      // Arrange
      repoStub.findByDomainId.resolves(null);

      const dto = {
        name: null as unknown as string,
        description: 'Invalid category',
      };

      // Act
      const result = await service.createCategory(dto);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(repoStub.save.called).to.be.false;
    });

    it('should fail when domain creation fails', async function () {
      // Arrange
      repoStub.findByDomainId.resolves(null);

      const dto: ICompTaskCategoryDTO = {
        name: 'Maintenance',
        description: null as unknown as string,
      };

      // Act
      const result = await service.createCategory(dto);

      // Assert
      expect(result.isFailure).to.be.true;
      expect(repoStub.save.called).to.be.false;
    });
  });

  describe('searchCategories', () => {
    it('should return mapped DTOs', async function () {
      // Arrange
      const domainObj = ComplementaryTaskCategory.create({
        code: GenericCode.create('CTC-001').getValue()!,
        name: 'Maintenance',
        description: 'Maintenance tasks',
        defaultDelay: Time.create({ minute: 30, hour: 0 }).getValue()!,
      }).getValue()!;

      repoStub.search.resolves([domainObj]);

      // Act
      const result = await service.searchCategories('Maintenance');

      // Assert
      expect(result.isSuccess).to.be.true;
      const list = result.getValue()!;
      expect(list).to.have.lengthOf(1);
      expect(list[0]!.name).to.equal('Maintenance');
    });

    it('should return empty list when no categories found', async function () {
      // Arrange
      repoStub.search.resolves([]);

      // Act
      const result = await service.searchCategories('Nonexistent');

      // Assert
      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.be.empty;
    });
  });
});

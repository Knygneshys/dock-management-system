/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import { expect } from 'chai';
import { Container } from 'typedi';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from '../../config';
import type ICompTaskCategoryService from '../../src/use-cases/IServices/ICompTaskCategoryService';
import type ICompTaskCategoryRepo from '../../src/domain/IRepos/ICompTaskCategoryRepo';

describe('CompTaskCategoryService + Repository - Integration Tests', function () {
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
    const ctcSchema = (await import('../../src/infrastructure/mongodb/persistence/schemas/compTaskCategorySchema'))
      .default;
    Container.set('compTaskCategorySchema', ctcSchema);

    // Setup repository
    const CompTaskCategoryRepo = (await import('../../src/infrastructure/mongodb/repos/compTaskCategoryRepo')).default;
    const repoInstance = Container.get(CompTaskCategoryRepo);
    Container.set(config.repos.compTaskCategory.name, repoInstance);

    // Setup service
    const CompTaskCategoryService = (await import('../../src/use-cases/services/compTaskCategoryService')).default;
    const serviceInstance = Container.get(CompTaskCategoryService);
    Container.set(config.services.compTaskCategory.name, serviceInstance);
  });

  afterEach(async function () {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  it('should create complementary task category and persist in database', async function () {
    // Arrange
    const service = Container.get<ICompTaskCategoryService>(config.services.compTaskCategory.name);
    const repo = Container.get<ICompTaskCategoryRepo>(config.repos.compTaskCategory.name);

    const dto = {
      name: 'Maintenance',
      description: 'Maintenance related tasks',
      defaultDelay: {
        hour: 1,
        minute: 30,
      },
    };

    // Act
    const result = await service.createCategory(dto);

    // Assert
    expect(result.isSuccess).to.be.true;
    const created = result.getValue()!;
    expect(created.code).to.not.be.undefined;
    expect(created.name).to.equal('Maintenance');

    // Verify persistence
    const { GenericCode } = await import('../../src/domain/object-values/genericCode');
    const codeObj = GenericCode.create(created.code!).getValue()!;
    const saved = await repo.findByDomainId(codeObj);

    expect(saved).to.not.be.null;
    expect(saved!.name).to.equal('Maintenance');
  });

  it('should create category without default delay', async function () {
    // Arrange
    const service = Container.get<ICompTaskCategoryService>(config.services.compTaskCategory.name);

    // Act
    const result = await service.createCategory({
      name: 'Inspection',
      description: 'Inspection tasks',
    });

    // Assert
    expect(result.isSuccess).to.be.true;
    const category = result.getValue()!;
    expect(category.defaultDelay).to.be.undefined;
  });

  it('should fail when category data is invalid', async function () {
    // Arrange
    const service = Container.get<ICompTaskCategoryService>(config.services.compTaskCategory.name);

    // Act
    const result = await service.createCategory({
      name: null as unknown as string,
      description: 'Invalid category',
    });

    // Assert
    expect(result.isFailure).to.be.true;
  });

  it('should search categories by name', async function () {
    // Arrange
    const service = Container.get<ICompTaskCategoryService>(config.services.compTaskCategory.name);

    await service.createCategory({
      name: 'Maintenance',
      description: 'Maintenance tasks',
    });

    await service.createCategory({
      name: 'Inspection',
      description: 'Inspection tasks',
    });

    await service.createCategory({
      name: 'Emergency Maintenance',
      description: 'Urgent tasks',
    });

    // Act
    const result = await service.searchCategories('Maintenance');

    // Assert
    expect(result.isSuccess).to.be.true;
    const categories = result.getValue()!;
    expect(categories).to.have.lengthOf(2);
  });

  it('should return all categories when no search term is provided', async function () {
    // Arrange
    const service = Container.get<ICompTaskCategoryService>(config.services.compTaskCategory.name);

    await service.createCategory({
      name: 'Maintenance',
      description: 'Maintenance tasks',
    });

    await service.createCategory({
      name: 'Inspection',
      description: 'Inspection tasks',
    });

    // Act
    const result = await service.searchCategories();

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.have.lengthOf(2);
  });
});

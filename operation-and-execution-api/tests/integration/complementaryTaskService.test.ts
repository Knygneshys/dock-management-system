/* eslint-disable @typescript-eslint/no-unused-expressions */
// oem-api-tests/integration/complementaryTaskService.test.ts
import 'reflect-metadata';
import { expect } from 'chai';
import { Container } from 'typedi';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from '../../config';
import { compTaskStatus } from '../../src/domain/enums/compTaskStatus';
import type ICompTaskService from '../../src/use-cases/IServices/ICompTaskService';
import type ICompTaskRepo from '../../src/domain/IRepos/ICompTaskRepo';

describe('ComplementaryTaskService + Repository - Integration Tests', function () {
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
    const compTaskSchema = (await import('../../src/infrastructure/mongodb/persistence/schemas/compTaskSchema'))
      .default;
    Container.set('compTaskSchema', compTaskSchema);

    // Setup repository
    const CompTaskRepo = (await import('../../src/infrastructure/mongodb/repos/compTaskRepo')).default;
    const compTaskRepoInstance = Container.get(CompTaskRepo);
    Container.set(config.repos.compTask.name, compTaskRepoInstance);

    // Setup service
    const CompTaskService = (await import('../../src/use-cases/services/compTaskService')).default;
    const compTaskServiceInstance = Container.get(CompTaskService);
    Container.set(config.services.compTask.name, compTaskServiceInstance);
  });

  afterEach(async function () {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  it('should create complementary task and persist in database', async function () {
    // Arrange
    const taskData = {
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    };

    const service = Container.get<ICompTaskService>(config.services.compTask.name);
    const repository = Container.get<ICompTaskRepo>(config.repos.compTask.name);

    // Act
    const result = await service.create(taskData);

    // Assert
    expect(result.isSuccess).to.be.true;
    const createdTask = result.getValue();
    expect(createdTask!.code).to.not.be.undefined;

    // Verify it's in the database
    const { GenericCode } = await import('../../src/domain/object-values/genericCode');
    const codeResult = GenericCode.create(createdTask!.code!);
    const savedTask = await repository.findByDomainCode(codeResult.getValue()!);
    expect(savedTask).to.not.be.null;
    expect(savedTask!.vveCode.value).to.equal(1001);
    expect(savedTask!.team).to.equal('Team A');
  });

  it('should update complementary task status', async function () {
    // Arrange
    const service = Container.get<ICompTaskService>(config.services.compTask.name);
    const repository = Container.get<ICompTaskRepo>(config.repos.compTask.name);

    const createResult = await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    const taskCode = createResult.getValue()!.code;
    const { GenericCode } = await import('../../src/domain/object-values/genericCode');
    const codeObj = GenericCode.create(taskCode!).getValue()!;

    // Act
    const updateResult = await service.update(
      {
        status: compTaskStatus.Completed,
        end: new Date('2025-12-30T15:00:00Z'),
      },
      codeObj,
    );

    // Assert
    expect(updateResult.isSuccess).to.be.true;

    const updatedTask = await repository.findByDomainCode(codeObj);
    expect(updatedTask!.status).to.equal(compTaskStatus.Completed);
    expect(updatedTask!.end).to.not.be.undefined;
  });

  it('should get all complementary tasks', async function () {
    // Arrange
    const service = Container.get<ICompTaskService>(config.services.compTask.name);

    await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-25T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    await service.create({
      vveCode: 1002,
      categoryCode: 'CAT-002',
      team: 'Team B',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: false,
    });

    // Act
    const result = await service.getAll();

    // Assert
    expect(result.isSuccess).to.be.true;
    const tasks = result.getValue();
    expect(tasks).to.have.lengthOf(2);
  });

  it('should get complementary tasks by VVE code', async function () {
    // Arrange
    const service = Container.get<ICompTaskService>(config.services.compTask.name);
    const { VVNCode } = await import('../../src/domain/object-values/vvnCode');

    await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-002',
      team: 'Team B',
      start: new Date('2025-12-30T14:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: false,
    });

    await service.create({
      vveCode: 1002,
      categoryCode: 'CAT-003',
      team: 'Team C',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    // Act
    const vveCodeObj = VVNCode.create(1001).getValue()!;
    const result = await service.getAllByVve(vveCodeObj);

    // Assert
    expect(result.isSuccess).to.be.true;
    const tasks = result.getValue();
    expect(tasks).to.have.lengthOf(2);
  });

  it('should search complementary tasks by date range', async function () {
    // Arrange
    const service = Container.get<ICompTaskService>(config.services.compTask.name);

    await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-25T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    await service.create({
      vveCode: 1002,
      categoryCode: 'CAT-002',
      team: 'Team B',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: false,
    });

    // Act - Search by date range
    const result = await service.search(new Date('2025-12-28'), new Date('2025-12-31'));

    // Assert
    expect(result.isSuccess).to.be.true;
    const tasks = result.getValue();
    expect(tasks).to.have.lengthOf(1);
  });

  it('should get complementary task by code', async function () {
    // Arrange
    const service = Container.get<ICompTaskService>(config.services.compTask.name);

    const createResult = await service.create({
      vveCode: 1001,
      categoryCode: 'CAT-001',
      team: 'Team A',
      start: new Date('2025-12-30T10:00:00Z'),
      status: compTaskStatus.Scheduled,
      impactOnOperations: true,
    });

    const taskCode = createResult.getValue()!.code;
    const { GenericCode } = await import('../../src/domain/object-values/genericCode');
    const codeObj = GenericCode.create(taskCode!).getValue()!;

    // Act
    const result = await service.getByCode(codeObj);

    // Assert
    expect(result.isSuccess).to.be.true;
    const task = result.getValue();
    expect(task!.code).to.equal(taskCode);
    expect(task!.vveCode).to.equal(1001);
  });
});

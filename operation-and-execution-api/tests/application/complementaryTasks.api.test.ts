/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// tests/application/complementaryTasks.api.test.ts
import 'reflect-metadata';
import request from 'supertest';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { compTaskStatus } from '../../src/domain/enums/compTaskStatus';

import { Application } from 'express';
import createTestApp from '../app.test';

describe('Complementary Tasks API - Application Tests', function () {
  let mongoServer: MongoMemoryServer;
  let app: Application;

  before(async function () {
    this.timeout(60000);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    app = await createTestApp();
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async function () {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  describe('POST /api/complementary-tasks', () => {
    it('should create a complementary task', async function () {
      // Arrange
      const taskData = {
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      };

      // Act
      const response = await request(app).post('/api/complementary-tasks').send(taskData).expect(201);

      // Assert
      expect(response.body).to.have.property('code');
      expect(response.body.vveCode).to.equal(1001);
      expect(response.body.team).to.equal('Team A');
    });

    it('should return 500 when required fields are missing', async function () {
      // Arrange
      const invalidData = {
        vveCode: 1001,
        // missing categoryCode, team, start
      };

      // Act
      const response = await request(app).post('/api/complementary-tasks').send(invalidData).expect(500);

      // Assert
      expect(response.body).to.have.property('errors');
    });
  });

  describe('GET /api/complementary-tasks', () => {
    it('should get all complementary tasks', async function () {
      // Arrange - Create tasks first
      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      });

      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1002,
        categoryCode: 'CAT-002',
        team: 'Team B',
        start: '2025-12-31T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: false,
      });

      // Act
      const response = await request(app).get('/api/complementary-tasks').expect(200);

      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
    });

    it('should search complementary tasks by date range', async function () {
      // Arrange
      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-25T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      });

      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1002,
        categoryCode: 'CAT-002',
        team: 'Team B',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: false,
      });

      // Act
      const response = await request(app).get('/api/complementary-tasks?start=2025-12-28&end=2025-12-31').expect(200);

      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(1);
      expect(response.body[0].vveCode).to.equal(1002);
    });
  });

  describe('GET /api/complementary-tasks/vve/:vveCode', () => {
    it('should get complementary tasks by VVE code', async function () {
      // Arrange
      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      });

      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1001,
        categoryCode: 'CAT-002',
        team: 'Team B',
        start: '2025-12-30T14:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: false,
      });

      await request(app).post('/api/complementary-tasks').send({
        vveCode: 1002,
        categoryCode: 'CAT-003',
        team: 'Team C',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      });

      // Act
      const response = await request(app).get('/api/complementary-tasks/vve/1001').expect(200);

      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0].vveCode).to.equal(1001);
      expect(response.body[1].vveCode).to.equal(1001);
    });
  });

  describe('PUT /api/complementary-tasks/:code', () => {
    it('should update complementary task', async function () {
    // Arrange
    const createResponse = await request(app)
      .post('/api/complementary-tasks')
      .send({
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true
      });

    const taskCode = createResponse.body.code;

    // Act
    const putResponse = await request(app)
      .put(`/api/complementary-tasks/${taskCode}`)
      .send({
        status: compTaskStatus.Completed,
        end: '2025-12-30T15:00:00Z'
      });
    
    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert
    const getResponse = await request(app)
      .get(`/api/complementary-tasks/${taskCode}`);

    expect(getResponse.status).to.equal(200);
    expect(getResponse.body.status).to.equal(compTaskStatus.Completed);
    expect(getResponse.body.end).to.not.be.null;
  });

    describe('GET /api/complementary-tasks/:code', () => {
      it('should get complementary task by code', async function () {
        // Arrange
        const createResponse = await request(app).post('/api/complementary-tasks').send({
          vveCode: 1001,
          categoryCode: 'CAT-001',
          team: 'Team A',
          start: '2025-12-30T10:00:00Z',
          status: compTaskStatus.Scheduled,
          impactOnOperations: true,
        });

        const taskCode = createResponse.body.code;

        // Act
        const response = await request(app).get(`/api/complementary-tasks/${taskCode}`).expect(200);

        // Assert
        expect(response.body.code).to.equal(taskCode);
        expect(response.body.vveCode).to.equal(1001);
      });

      it('should return 404 when task not found', async function () {
        // Act
        await request(app).get('/api/complementary-tasks/NONEXISTENT').expect(404);
      });
    });
  });
});

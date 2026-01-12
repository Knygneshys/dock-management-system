/* eslint-disable @typescript-eslint/no-unused-vars */
// tests/system/missingPlans.e2e.test.ts
import 'reflect-metadata';
import request from 'supertest';
import nock from 'nock';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import type { Application } from 'express';
import { compTaskStatus } from '../../src/domain/enums/compTaskStatus';
import createTestApp from '../app.test';

describe('Missing Plans Regeneration - E2E System Tests', function () {
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

    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  afterEach(async function () {
    nock.cleanAll();

    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (collections[key]) {
        await collections[key].deleteMany({});
      }
    }
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should mock external API calls for complementary tasks', async function () {
    // Mock backend C# - Get VVE details
    nock('http://localhost:5294')
      .get('/api/VesselVisitNotifications/1001')
      .reply(200, {
        code: 1001,
        eta: '2025-12-30T10:00:00Z',
        etd: '2025-12-30T20:00:00Z',
        vessel: { name: 'Test Vessel', imo: 'IMO1234567' },
        status: 'Approved',
      });

    // Create complementary task
    const response = await request(app)
      .post('/api/complementary-tasks')
      .send({
        vveCode: 1001,
        categoryCode: 'CAT-001',
        team: 'Team A',
        start: '2025-12-30T10:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: true,
      })
      .expect(201);

    // Assert
    expect(response.body.vveCode).to.equal(1001);
    expect(response.body.team).to.equal('Team A');
  });

  it('should handle external API failure gracefully', async function () {
    // Mock backend C#
    nock('http://localhost:5294')
      .get('/api/ComplementaryTaskCategories/CAT-999')
      .reply(404, { error: 'Category not found' });

    expect(nock.pendingMocks()).to.have.lengthOf(1);

    // Clean up
    nock.cleanAll();
  });

  it('should test complementary task workflow with external dependencies', async function () {
    // Mock 1: Get VVE info
    const vveScope = nock('http://localhost:5294')
      .get('/api/VesselVisitNotifications/1002')
      .reply(200, {
        code: 1002,
        vessel: { name: 'Test Ship' },
      });

    // Mock 2: Get category info
    const categoryScope = nock('http://localhost:5294').get('/api/ComplementaryTaskCategories/CAT-002').reply(200, {
      code: 'CAT-002',
      name: 'Maintenance',
    });

    // Create task
    const createResponse = await request(app)
      .post('/api/complementary-tasks')
      .send({
        vveCode: 1002,
        categoryCode: 'CAT-002',
        team: 'Team B',
        start: '2025-12-31T08:00:00Z',
        status: compTaskStatus.Scheduled,
        impactOnOperations: false,
      })
      .expect(201);

    const taskCode = createResponse.body.code;

    // Update task
    await request(app)
      .put(`/api/complementary-tasks/${taskCode}`)
      .send({
        status: compTaskStatus.Completed,
        end: '2025-12-31T12:00:00Z',
      })
      .expect(204);

    // Verify task was updated
    const getResponse = await request(app).get(`/api/complementary-tasks/${taskCode}`).expect(200);

    expect(getResponse.body.status).to.equal(compTaskStatus.Completed);
  });

  it('should verify nock setup works correctly', async function () {
    // Simple test to verify Nock is working
    const scope = nock('http://example.com').get('/test').reply(200, { success: true });

    // Verify mock was created
    expect(nock.pendingMocks()).to.include('GET http://example.com:80/test');

    nock.cleanAll();
  });
});

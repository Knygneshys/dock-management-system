/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import request from 'supertest';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Application } from 'express';
import createTestApp from '../app.test';

describe('Complementary Task Categories API - Application Tests', function () {
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

  describe('POST /api/complementary-task-categories', () => {
    it('should create a complementary task category', async function () {
      // Arrange
      const categoryData = {
        name: 'Maintenance',
        description: 'Maintenance related tasks',
        defaultDelay: {
          hour: 1,
          minute: 30,
        },
      };

      // Act
      const response = await request(app).post('/api/complementary-task-categories').send(categoryData).expect(201);

      // Assert
      expect(response.body).to.have.property('code');
      expect(response.body.name).to.equal('Maintenance');
      expect(response.body.description).to.equal('Maintenance related tasks');
      expect(response.body.defaultDelay).to.deep.equal({
        hour: 1,
        minute: 30,
      });
    });

    it('should create a category without default delay', async function () {
      // Arrange
      const categoryData = {
        name: 'Inspection',
        description: 'Inspection related tasks',
      };

      // Act
      const response = await request(app).post('/api/complementary-task-categories').send(categoryData).expect(201);

      // Assert
      expect(response.body).to.have.property('code');
      expect(response.body.defaultDelay).to.be.undefined;
    });

    it('should return 500 when required fields are missing', async function () {
      // Arrange
      const invalidData = {
        description: 'Missing name',
      };

      // Act
      const response = await request(app).post('/api/complementary-task-categories').send(invalidData).expect(500);

      // Assert
      expect(response.body).to.have.property('errors');
    });
  });

  describe('GET /api/complementary-task-categories', () => {
    it('should get all complementary task categories', async function () {
      // Arrange
      await request(app).post('/api/complementary-task-categories').send({
        name: 'Maintenance',
        description: 'Maintenance tasks',
      });

      await request(app).post('/api/complementary-task-categories').send({
        name: 'Inspection',
        description: 'Inspection tasks',
      });

      // Act
      const response = await request(app).get('/api/complementary-task-categories').expect(200);

      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
    });

    it('should search categories by name', async function () {
      // Arrange
      await request(app).post('/api/complementary-task-categories').send({
        name: 'Maintenance',
        description: 'Maintenance tasks',
      });

      await request(app).post('/api/complementary-task-categories').send({
        name: 'Emergency Maintenance',
        description: 'Urgent maintenance tasks',
      });

      await request(app).post('/api/complementary-task-categories').send({
        name: 'Inspection',
        description: 'Inspection tasks',
      });

      // Act
      const response = await request(app).get('/api/complementary-task-categories?name=Maintenance').expect(200);

      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0].name).to.include('Maintenance');
    });
  });
});

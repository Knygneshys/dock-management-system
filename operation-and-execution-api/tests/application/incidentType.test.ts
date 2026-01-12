/* eslint-disable @typescript-eslint/no-unused-expressions */
import 'reflect-metadata';
import request from 'supertest';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import type { Application } from 'express';
import createTestApp from '../app.test';
import { IncidentTypeProvider } from '../providers/IncidentTypeProvider';

describe('Incident Type Creation - E2E System Tests', function () {
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

  describe('create endpoint', function () {
    it('should create incidentType and return its code', async function () {
      // Arrange
      const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      const uri = '/api/incident-type';

      //Act
      const response = await request(app).post(uri).send(command).expect(201);

      // Assert
      expect(response.body).to.equal(command.code);
    });

    it('should fail to create an incidentType and return 400 when it already exists', async function () {
      // Arrange
      const command = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      const uri = '/api/incident-type';

      await request(app).post(uri).send(command).expect(201);

      // Act
      const response = await request(app).post(uri).send(command).expect(400);

      // Assert
      expect(response.body).to.not.be.null;
    });
  });

  describe('getByCode endpoint', function () {
    it('should return the correct IncidentType from the 2 available', async function () {
      // Arrange
      const command1 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command1.code = 'INC-001';
      command1.name = 'First Incident';
      await request(app).post('/api/incident-type').send(command1).expect(201);

      const command2 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command2.code = 'INC-002';
      command2.name = 'Second Incident';
      await request(app).post('/api/incident-type').send(command2).expect(201);

      // Act
      const response = await request(app).get(`/api/incident-type/${command2.code}`).expect(200);

      // Assert
      expect(response.body.code).to.equal('INC-002');
      expect(response.body.name).to.equal('Second Incident');
      expect(response.body).to.have.property('severity');
    });

    it('should fail to return anything when the code does not exist among 2 available', async function () {
      // Arrange
      const command1 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command1.code = 'INC-001';
      await request(app).post('/api/incident-type').send(command1).expect(201);

      const command2 = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      command2.code = 'INC-002';
      await request(app).post('/api/incident-type').send(command2).expect(201);

      const nonExistentCode = 'INC-999';

      // Act
      const response = await request(app).get(`/api/incident-type/${nonExistentCode}`).expect(400);

      // Assert
      expect(response.body).to.not.be.null;
    });
  });

  describe('update endpoint', function () {
    it('should successfully update an IncidentType and return 200', async function () {
      // Arrange
      const uri = '/api/incident-type';
      const code = 'ADKG12';
      const initialName = 'Initial Name';
      const updatedName = 'Updated Name';
      const updatedDescription = 'Updated Description';

      const initialCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      initialCommand.code = code;
      initialCommand.name = initialName;
      await request(app).post(uri).send(initialCommand).expect(201);

      const updateData = IncidentTypeProvider.provideUpdateIncidentTypeCommand();
      updateData.name = updatedName;
      updateData.description = updatedDescription;

      // Act
      const response = await request(app).put(`${uri}/${initialCommand.code}`).send(updateData).expect(200);

      // Assert
      expect(response.body.code).to.equal(code);
      expect(response.body.name).to.equal(updatedName);
      expect(response.body.description).to.equal(updatedDescription);
      expect(response.body).to.have.property('severity');
    });

    it('should fail and return 400 when updating with a non-existent parent code', async function () {
      // Arrange
      const uri = '/api/incident-type';
      const code = 'TARGET-01';
      const parentCode = 'NON-EXISTENT-PARENT';

      const initialCommand = IncidentTypeProvider.provideCreateIncidentTypeCommand();
      initialCommand.code = code;
      await request(app).post(uri).send(initialCommand).expect(201);

      const updateData = IncidentTypeProvider.provideUpdateIncidentTypeCommandWithParent();
      updateData.parentIncidentTypeCode = parentCode;

      // Act
      const response = await request(app).put(`${uri}/${code}`).send(updateData).expect(400); // Controller returns 400 when serviceResult.isFailure is true

      // Assert
      expect(response.body).to.not.be.null;
    });
  });
});

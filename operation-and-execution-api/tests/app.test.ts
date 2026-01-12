import 'reflect-metadata';
import express from 'express';
import loaders from '../src/loaders';

async function createTestApp() {
  const app = express();
  
  await loaders({ expressApp: app });
  return app;
}

export default createTestApp;

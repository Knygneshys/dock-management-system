import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
  if (!config.databaseURL) {
    throw new Error('config.databaseURL not defined!');
  }

  const connection = await mongoose.connect(config.databaseURL);
  const db = connection.connection.db;

  if (!db) {
    throw new Error('Failed to get database connection');
  }

  return db;
};

import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongodb: MongoMemoryServer | undefined;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongodb = await MongoMemoryServer.create();
      const mongoUri = mongodb.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeDBConnection = async () => {
  await mongoose.disconnect();
  if (mongodb) {
    await mongodb.stop();
    mongodb = undefined;
  }
};

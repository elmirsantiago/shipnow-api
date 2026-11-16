
import mongoose from "mongoose";
import config from "../../../src/config/index.js";

const TEST_DATABASE_NAME = "shipnow_test";

const assertTestEnvironment = () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "SEGURIDAD: los tests funcionales requieren NODE_ENV=test"
    );
  }

  const uri = new URL(config.mongodbUri);

  if (
    uri.protocol !== "mongodb:" ||
    !["127.0.0.1", "localhost"].includes(uri.hostname) ||
    uri.port !== "27017" ||
    uri.pathname !== `/${TEST_DATABASE_NAME}` ||
    uri.username ||
    uri.password ||
    uri.search
  ) {
    throw new Error(
      "SEGURIDAD: la URI debe apuntar exclusivamente a MongoDB local /shipnow_test"
    );
  }
};

export const connectTestDatabase = async () => {
  assertTestEnvironment();

  await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 5000
  });

  if (mongoose.connection.name !== TEST_DATABASE_NAME) {
    await mongoose.disconnect();

    throw new Error(
      "SEGURIDAD: la conexión no corresponde a shipnow_test"
    );
  }
};

export const clearTestDatabase = async () => {
  assertTestEnvironment();

  if (
    mongoose.connection.readyState !== 1 ||
    mongoose.connection.name !== TEST_DATABASE_NAME
  ) {
    throw new Error(
      "SEGURIDAD: no se permite limpiar una base distinta de shipnow_test"
    );
  }

  const collections = Object.values(mongoose.connection.collections);

  for (const collection of collections) {
    await collection.deleteMany({});
  }
};

export const disconnectTestDatabase = async () => {
  await mongoose.disconnect();
};


import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);

    logger.info("Conexión a MongoDB establecida");
  } catch (error) {
    logger.fatal(
      `Error crítico al conectar con MongoDB: ${error.message}`
    );

    throw error;
  }
};

export default connectDB;

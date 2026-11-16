
import mongoose from "mongoose";
import multer from "multer";

import AppError from "../errors/AppError.js";
import { ERROR_DICTIONARY } from "../errors/errorDictionary.js";
import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  const requestInfo = `${req.method} ${req.originalUrl}`;

  // 1. Errores personalizados de ShipNow
  if (err instanceof AppError) {
    const logMessage = `${requestInfo} - ${err.code}: ${err.message}`;

    if (err.statusCode >= 500) {
      logger.error(logMessage);
    } else {
      logger.warning(logMessage);
    }

    return res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message
    });
  }

  // 2. Errores propios de Multer
  if (err instanceof multer.MulterError) {
    let errorType = "FILE_UPLOAD_ERROR";

    if (err.code === "LIMIT_FILE_SIZE") {
      errorType = "FILE_TOO_LARGE";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      errorType = "INVALID_FILE_FIELD";
    } else if (
      [
        "LIMIT_FILE_COUNT",
        "LIMIT_FIELD_COUNT",
        "LIMIT_PART_COUNT",
        "LIMIT_FIELD_KEY",
        "LIMIT_FIELD_VALUE"
      ].includes(err.code)
    ) {
      errorType = "INVALID_DATA";
    }

    const error = ERROR_DICTIONARY[errorType];

    logger.warning(
      `${requestInfo} - Error de Multer: ${err.code}`
    );

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 3. Errores de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    logger.warning(
      `${requestInfo} - Error de validación: ${err.message}`
    );

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 4. IDs o valores incorrectos en Mongoose
  if (err instanceof mongoose.Error.CastError) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    logger.warning(
      `${requestInfo} - Valor inválido: ${err.message}`
    );

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: "Uno de los valores proporcionados no es válido"
    });
  }

  // 5. Datos duplicados en MongoDB
  if (err.code === 11000) {
    const error = ERROR_DICTIONARY.DUPLICATE_DATA;

    logger.warning(
      `${requestInfo} - Intento de registrar datos duplicados`
    );

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 6. JSON mal formado
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    logger.warning(
      `${requestInfo} - La petición contiene un JSON inválido`
    );

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: "El cuerpo de la petición contiene un JSON inválido"
    });
  }

  // 7. Errores de conexión u operaciones de MongoDB
  if (
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoServerError" ||
    err.name === "MongoNetworkError"
  ) {
    logger.error(
      `${requestInfo} - Error de base de datos: ${err.message}`
    );

    const error = ERROR_DICTIONARY.DATABASE_ERROR;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 8. Errores inesperados
  logger.error(
    `${requestInfo} - Error inesperado: ${err.stack || err.message}`
  );

  const error = ERROR_DICTIONARY.INTERNAL_ERROR;

  return res.status(error.statusCode).json({
    status: "error",
    code: error.code,
    message: error.message
  });
};

export default errorHandler;

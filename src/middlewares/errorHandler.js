
import mongoose from "mongoose";

import AppError from "../errors/AppError.js";
import { ERROR_DICTIONARY } from "../errors/errorDictionary.js";

const errorHandler = (err, req, res, next) => {
  // 1. Errores personalizados de ShipNow
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message
    });
  }

  // 2. Errores de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 3. IDs o valores incorrectos en Mongoose
  if (err instanceof mongoose.Error.CastError) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: "Uno de los valores proporcionados no es válido"
    });
  }

  // 4. Datos duplicados en MongoDB
  if (err.code === 11000) {
    const error = ERROR_DICTIONARY.DUPLICATE_DATA;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 5. JSON mal formado
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    const error = ERROR_DICTIONARY.INVALID_DATA;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: "El cuerpo de la petición contiene un JSON inválido"
    });
  }

  // 6. Errores de conexión u operaciones de MongoDB
  if (
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoServerError" ||
    err.name === "MongoNetworkError"
  ) {
    console.error("Error de base de datos:", err);

    const error = ERROR_DICTIONARY.DATABASE_ERROR;

    return res.status(error.statusCode).json({
      status: "error",
      code: error.code,
      message: error.message
    });
  }

  // 7. Errores inesperados
  console.error("Error inesperado:", err);

  const error = ERROR_DICTIONARY.INTERNAL_ERROR;

  return res.status(error.statusCode).json({
    status: "error",
    code: error.code,
    message: error.message
  });
};

export default errorHandler;

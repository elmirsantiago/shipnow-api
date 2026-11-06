import { jest } from "@jest/globals";
import mongoose from "mongoose";
import errorHandler from "../src/middlewares/errorHandler.js";

describe("ShipNow API - Errores de MongoDB", () => {
  const executeHandler = (error) => {
    const req = {};

    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };

    errorHandler(error, req, res, () => {});

    return res;
  };

  test("Debe manejar datos duplicados", () => {
    const error = new Error("Duplicate key");
    error.code = 11000;

    const response = executeHandler(error);

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      status: "error",
      code: "DUPLICATE_DATA",
      message: "Ya existe un registro con esos datos"
    });
  });

  test("Debe manejar errores de validación de Mongoose", () => {
    const error = new mongoose.Error.ValidationError();

    const response = executeHandler(error);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: "INVALID_DATA",
      message: "Los datos proporcionados no son válidos"
    });
  });

  test("Debe manejar errores de conversión de Mongoose", () => {
    const error = new mongoose.Error.CastError(
      "ObjectId",
      "id-invalido",
      "_id"
    );

    const response = executeHandler(error);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("INVALID_DATA");
  });

  test("Debe manejar errores de MongoDB", () => {
    const error = new Error("Database unavailable");
    error.name = "MongoNetworkError";

    const consoleSpy = jest.spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = executeHandler(error);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        status: "error",
        code: "DATABASE_ERROR",
        message: "Error al realizar una operación en la base de datos"
      });
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

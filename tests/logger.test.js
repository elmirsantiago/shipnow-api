
import { jest } from "@jest/globals";
import request from "supertest";

import app from "../src/app.js";
import logger from "../src/config/logger.js";

describe("Módulo 4 - Logging con Winston", () => {
  let spies;

  beforeEach(() => {
    spies = {};

    for (const level of [
      "debug",
      "http",
      "info",
      "warning",
      "error",
      "fatal"
    ]) {
      spies[level] = jest
        .spyOn(logger, level)
        .mockImplementation(() => logger);
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("El endpoint del logger responde correctamente", async () => {
    const response = await request(app).get("/api/loggerTest");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe(
      "Prueba de logging ejecutada correctamente"
    );
  });

  test("El endpoint ejecuta los seis niveles de logging", async () => {
    const response = await request(app).get("/api/loggerTest");

    expect(response.statusCode).toBe(200);

    for (const level of [
      "debug",
      "http",
      "info",
      "warning",
      "error",
      "fatal"
    ]) {
      expect(spies[level]).toHaveBeenCalledTimes(1);
    }
  });

  test("Winston tiene configurados los seis niveles", () => {
    expect(logger.levels).toEqual({
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5
    });
  });

  test("El logger tiene configurados los tres transportes", () => {
    expect(logger.transports).toHaveLength(3);
  });
});

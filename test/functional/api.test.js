
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("ShipNow API - Mocks, Logger y Swagger", function () {
  this.timeout(15000);

  const expectError = (response, status, code) => {
    expect(response.status).to.equal(status);
    expect(response.body).to.be.an("object");
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal(code);
    expect(response.body.message).to.be.a("string").and.not.empty;
  };

  it("GET /api/mocks/users - genera usuarios ficticios", async function () {
    const response = await request(app).get("/api/mocks/users?qty=3");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array").with.lengthOf(3);
    expect(response.body[0]).to.be.an("object");
    expect(response.body[0]).to.have.property("email");
  });

  it("GET /api/mocks/couriers - genera repartidores ficticios", async function () {
    const response = await request(app).get("/api/mocks/couriers?qty=2");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array").with.lengthOf(2);
    expect(response.body[0]).to.be.an("object");
  });

  it("GET /api/mocks/orders - genera pedidos ficticios", async function () {
    const response = await request(app).get("/api/mocks/orders?qty=2");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array").with.lengthOf(2);
    expect(response.body[0]).to.have.property("items");
    expect(response.body[0].items).to.be.an("array");
  });

  it("GET /api/mocks/deliveries - genera entregas ficticias", async function () {
    const response = await request(app).get("/api/mocks/deliveries?qty=2");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array").with.lengthOf(2);
    expect(response.body[0]).to.be.an("object");
  });

  it("GET /api/mocks/users - rechaza una cantidad inválida", async function () {
    const response = await request(app).get("/api/mocks/users?qty=0");

    expectError(response, 400, "INVALID_MOCK_QUANTITY");
  });

  it("GET /api/mocks/orders - rechaza cantidades mayores a 100", async function () {
    const response = await request(app).get("/api/mocks/orders?qty=101");

    expectError(response, 400, "INVALID_MOCK_QUANTITY");
  });

  it("GET /api/loggerTest - responde con los niveles del logger", async function () {
    const response = await request(app).get("/api/loggerTest");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.be.a("string");
    expect(response.body.levels).to.include.members([
      "debug",
      "http",
      "info",
      "warning",
      "error",
      "fatal"
    ]);
  });

  it("GET /api/docs/ - permite acceder a Swagger UI", async function () {
    const response = await request(app).get("/api/docs/");

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.include("text/html");
    expect(response.text).to.include("swagger-ui");
  });

  it("GET /ruta-inexistente - devuelve un error 404 estructurado", async function () {
    const response = await request(app).get("/ruta-inexistente");

    expectError(response, 404, "ROUTE_NOT_FOUND");
  });
});

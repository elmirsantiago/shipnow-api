
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app.js";

import {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase
} from "./helpers/testDatabase.js";

describe("ShipNow API - Tests funcionales de usuarios", function () {
  this.timeout(15000);

  before(async function () {
    await connectTestDatabase();
  });

  beforeEach(async function () {
    await clearTestDatabase();
  });

  after(async function () {
    await disconnectTestDatabase();
  });

  it("GET /api/users - devuelve la lista de usuarios", async function () {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
    expect(response.body.payload).to.have.lengthOf(0);
  });

  it("GET /api/users - devuelve paginación por defecto", async function () {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.pagination).to.deep.equal({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    });
  });

  it("GET /api/users - pagina los resultados y oculta contraseñas", async function () {
    const users = [
      {
        firstName: "Ana",
        lastName: "Testing",
        email: "ana@shipnow.test",
        password: "Password123!"
      },
      {
        firstName: "Bruno",
        lastName: "Testing",
        email: "bruno@shipnow.test",
        password: "Password123!"
      },
      {
        firstName: "Carla",
        lastName: "Testing",
        email: "carla@shipnow.test",
        password: "Password123!"
      }
    ];

    for (const user of users) {
      const created = await request(app)
        .post("/api/users")
        .send(user);

      expect(created.status).to.equal(201);
    }

    const firstPage = await request(app)
      .get("/api/users?page=1&limit=2");

    const secondPage = await request(app)
      .get("/api/users?page=2&limit=2");

    expect(firstPage.status).to.equal(200);
    expect(firstPage.body.payload).to.have.lengthOf(2);
    expect(firstPage.body.pagination).to.deep.equal({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2
    });

    expect(secondPage.status).to.equal(200);
    expect(secondPage.body.payload).to.have.lengthOf(1);
    expect(secondPage.body.pagination.page).to.equal(2);

    const firstIds = firstPage.body.payload.map(user => user._id);
    const secondIds = secondPage.body.payload.map(user => user._id);

    expect(firstIds).to.not.include(secondIds[0]);

    for (const user of [
      ...firstPage.body.payload,
      ...secondPage.body.payload
    ]) {
      expect(user).to.not.have.property("password");
    }
  });

  it("GET /api/users - rechaza límites superiores a 100", async function () {
    const response = await request(app)
      .get("/api/users?limit=500");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_DATA");
  });

  it("GET /api/users - rechaza páginas inválidas", async function () {
    const response = await request(app)
      .get("/api/users?page=0");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_DATA");
  });

  it("POST /api/users - crea un usuario válido", async function () {
    const user = {
      firstName: "Usuario",
      lastName: "Testing",
      email: "usuario.testing@shipnow.test",
      password: "Password123!"
    };

    const response = await request(app)
      .post("/api/users")
      .send(user);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
    expect(response.body.payload.firstName).to.equal(user.firstName);
    expect(response.body.payload.lastName).to.equal(user.lastName);
    expect(response.body.payload.email).to.equal(user.email);
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload).to.not.have.property("password");
  });

  it("POST /api/users - rechaza datos incompletos", async function () {
    const response = await request(app)
      .post("/api/users")
      .send({
        firstName: "Usuario"
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_DATA");
    expect(response.body.message).to.be.a("string");
  });

  it("GET /api/users/:uid - devuelve 404 si el usuario no existe", async function () {
    const nonexistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get(`/api/users/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.be.a("string");
  });

  it("GET /api/users/:uid - rechaza un ID inválido", async function () {
    const response = await request(app)
      .get("/api/users/id-invalido");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_DATA");
    expect(response.body.message).to.be.a("string");
  });
});

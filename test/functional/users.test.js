
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


import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import StoreModel from "../../src/models/store.model.js";
import OrderModel from "../../src/models/order.model.js";
import DeliveryModel from "../../src/models/delivery.model.js";

import {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase
} from "./helpers/testDatabase.js";

describe("ShipNow API - Testing funcional de Seed", function () {
  this.timeout(15000);

  before(async function () {
    await connectTestDatabase();
  });

  beforeEach(async function () {
    await clearTestDatabase();
  });

  after(async function () {
    try {
      await clearTestDatabase();
    } finally {
      await disconnectTestDatabase();
    }
  });

  it("POST /api/mocks/seed - inserta datos ficticios correctamente", async function () {
    const owner = await UserModel.create({
      firstName: "Propietario",
      lastName: "Testing",
      email: "propietario@shipnow.test",
      password: "Password123!"
    });

    await StoreModel.create({
      name: "Comercio Seed Testing",
      address: "Calle Test 123",
      owner: owner._id,
      isActive: true
    });

    const response = await request(app)
      .post("/api/mocks/seed?qty=2");

    expect(response.status).to.equal(201);
    expect(response.body.message).to.be.a("string");
    expect(response.body.inserted).to.be.an("object");

    expect(response.body.inserted.users).to.equal(2);
    expect(response.body.inserted.couriers).to.equal(2);
    expect(response.body.inserted.orders).to.equal(2);
    expect(response.body.inserted.deliveries).to.equal(2);

    expect(await UserModel.countDocuments()).to.equal(5);
    expect(await StoreModel.countDocuments()).to.equal(1);
    expect(await OrderModel.countDocuments()).to.equal(2);
    expect(await DeliveryModel.countDocuments()).to.equal(2);
  });

  it("POST /api/mocks/seed - rechaza cantidades inválidas", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=0");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_MOCK_QUANTITY");
    expect(response.body.message).to.be.a("string");
  });

  it("POST /api/mocks/seed - rechaza la inserción sin comercios activos", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=2");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("NO_ACTIVE_STORES");
    expect(response.body.message).to.be.a("string");
  });
});

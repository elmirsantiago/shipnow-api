
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import StoreModel from "../../src/models/store.model.js";

import {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase
} from "./helpers/testDatabase.js";

describe("ShipNow API - Tests funcionales de pedidos", function () {
  this.timeout(15000);

  let customer;
  let store;

  before(async function () {
    await connectTestDatabase();
  });

  beforeEach(async function () {
    await clearTestDatabase();

    customer = await UserModel.create({
      firstName: "Cliente",
      lastName: "Testing",
      email: "cliente@shipnow.test",
      password: "Password123!"
    });

    store = await StoreModel.create({
      name: "Comercio Testing",
      address: "Calle Test 123",
      owner: customer._id,
      isActive: true
    });
  });

  after(async function () {
    await disconnectTestDatabase();
  });

  const buildOrder = () => ({
    customer: customer._id.toString(),
    store: store._id.toString(),
    items: [
      {
        name: "Producto de prueba",
        quantity: 2,
        price: 1500
      }
    ],
    deliveryAddress: "Calle Destino 456",
    priority: "normal"
  });

  const expectError = (response, status, code) => {
    expect(response.status).to.equal(status);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal(code);
    expect(response.body.message).to.be.a("string");
  };

  it("GET /api/orders - devuelve una lista de pedidos", async function () {
    const response = await request(app).get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
  });

  it("POST /api/orders - crea un pedido válido", async function () {
    const response = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.total).to.equal(3000);
    expect(response.body.payload.status).to.equal("created");
    expect(response.body.payload.items).to.have.lengthOf(1);
  });

  it("GET /api/orders/:oid - consulta un pedido existente", async function () {
    const created = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    expect(created.status).to.equal(201);

    const orderId = created.body.payload._id;

    const response = await request(app)
      .get(`/api/orders/${orderId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload._id).to.equal(orderId);
    expect(response.body.payload.total).to.equal(3000);
  });

  it("PUT /api/orders/:oid/status - actualiza el estado", async function () {
    const created = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    expect(created.status).to.equal(201);

    const response = await request(app)
      .put(`/api/orders/${created.body.payload._id}/status`)
      .send({ status: "assigned" });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.status).to.equal("assigned");
  });

  it("POST /api/orders - rechaza datos incompletos", async function () {
    const response = await request(app)
      .post("/api/orders")
      .send({
        customer: customer._id.toString()
      });

    expectError(response, 400, "INVALID_DATA");
  });

  it("GET /api/orders/:oid - devuelve 404 si no existe", async function () {
    const nonexistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get(`/api/orders/${nonexistentId}`);

    expectError(response, 404, "ORDER_NOT_FOUND");
  });

  it("PUT /api/orders/:oid/status - rechaza estados inválidos", async function () {
    const created = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    expect(created.status).to.equal(201);

    const response = await request(app)
      .put(`/api/orders/${created.body.payload._id}/status`)
      .send({ status: "estado_inventado" });

    expectError(response, 400, "INVALID_ORDER_STATUS");
  });
});


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

  it("GET /api/orders - devuelve paginación por defecto", async function () {
    const response = await request(app).get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.pagination).to.deep.equal({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    });
  });

  it("GET /api/orders - pagina correctamente los pedidos", async function () {
    for (let i = 0; i < 3; i++) {
      const created = await request(app)
        .post("/api/orders")
        .send(buildOrder());

      expect(created.status).to.equal(201);
    }

    const firstPage = await request(app)
      .get("/api/orders?page=1&limit=2");

    const secondPage = await request(app)
      .get("/api/orders?page=2&limit=2");

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

    const firstIds = firstPage.body.payload.map(order => order._id);
    const secondIds = secondPage.body.payload.map(order => order._id);

    expect(firstIds).to.not.include(secondIds[0]);

    for (const order of [
      ...firstPage.body.payload,
      ...secondPage.body.payload
    ]) {
      expect(order.customer).to.be.an("object");
      expect(order.customer).to.not.have.property("password");
      expect(order.store).to.be.an("object");
    }
  });

  it("GET /api/orders - rechaza límites superiores a 100", async function () {
    const response = await request(app)
      .get("/api/orders?limit=500");

    expectError(response, 400, "INVALID_DATA");
  });

  it("GET /api/orders - rechaza páginas inválidas", async function () {
    const response = await request(app)
      .get("/api/orders?page=0");

    expectError(response, 400, "INVALID_DATA");
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

  it("GET /api/orders - filtra pedidos por estado", async function () {
    const firstOrder = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    const secondOrder = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    expect(firstOrder.status).to.equal(201);
    expect(secondOrder.status).to.equal(201);

    const updated = await request(app)
      .put(`/api/orders/${secondOrder.body.payload._id}/status`)
      .send({ status: "assigned" });

    expect(updated.status).to.equal(200);

    const response = await request(app)
      .get("/api/orders?status=created");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.lengthOf(1);
    expect(response.body.payload[0].status).to.equal("created");
    expect(response.body.pagination.total).to.equal(1);
  });

  it("GET /api/orders - filtra pedidos por prioridad", async function () {
    const normalOrder = await request(app)
      .post("/api/orders")
      .send(buildOrder());

    const highOrder = await request(app)
      .post("/api/orders")
      .send({
        ...buildOrder(),
        priority: "high"
      });

    expect(normalOrder.status).to.equal(201);
    expect(highOrder.status).to.equal(201);

    const response = await request(app)
      .get("/api/orders?priority=high");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.lengthOf(1);
    expect(response.body.payload[0].priority).to.equal("high");
    expect(response.body.pagination.total).to.equal(1);
  });

  it("GET /api/orders - combina filtros y paginación", async function () {
    for (let i = 0; i < 3; i++) {
      const created = await request(app)
        .post("/api/orders")
        .send({
          ...buildOrder(),
          priority: "high"
        });

      expect(created.status).to.equal(201);
    }

    const response = await request(app)
      .get("/api/orders?status=created&priority=high&page=2&limit=2");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.lengthOf(1);
    expect(response.body.pagination).to.deep.equal({
      page: 2,
      limit: 2,
      total: 3,
      totalPages: 2
    });
  });

  it("GET /api/orders - rechaza filtros inválidos", async function () {
    const invalidStatus = await request(app)
      .get("/api/orders?status=inventado");

    const invalidPriority = await request(app)
      .get("/api/orders?priority=inventada");

    expectError(invalidStatus, 400, "INVALID_DATA");
    expectError(invalidPriority, 400, "INVALID_DATA");
  });
});

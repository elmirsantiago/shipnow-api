
import { jest, describe, test, expect } from "@jest/globals";
import request from "supertest";

// Simulamos la conexión a MongoDB para que
// las pruebas GET no necesiten una base activa.
jest.unstable_mockModule("../src/config/db.js", () => ({
  default: jest.fn()
}));

const { default: app } = await import("../src/app.js");

describe("ShipNow API - Mocking", () => {

  test("GET /api/mocks/users genera 5 usuarios", async () => {
    const response = await request(app)
      .get("/api/mocks/users?qty=5");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    response.body.forEach((user) => {
      expect(user.role).toBe("customer");
      expect(user).toHaveProperty("firstName");
      expect(user).toHaveProperty("lastName");
      expect(user).toHaveProperty("email");
    });
  });

  test("GET /api/mocks/couriers genera 5 repartidores", async () => {
    const response = await request(app)
      .get("/api/mocks/couriers?qty=5");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    response.body.forEach((courier) => {
      expect(courier.role).toBe("courier");
    });
  });

  test("GET /api/mocks/orders genera pedidos válidos", async () => {
    const response = await request(app)
      .get("/api/mocks/orders?qty=5");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    response.body.forEach((order) => {
      expect(order).toHaveProperty("customer");
      expect(order).toHaveProperty("store");
      expect(order).toHaveProperty("items");
      expect(order).toHaveProperty("total");
      expect(order.status).toBe("assigned");
    });
  });

  test("GET /api/mocks/deliveries genera entregas válidas", async () => {
    const response = await request(app)
      .get("/api/mocks/deliveries?qty=5");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);

    response.body.forEach((delivery) => {
      expect(delivery).toHaveProperty("order");
      expect(delivery).toHaveProperty("courier");
      expect(delivery.status).toBe("assigned");
    });
  });

  test("GET /api/mocks/users rechaza qty=0", async () => {
    const response = await request(app)
      .get("/api/mocks/users?qty=0");

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(
      /qty debe ser un número entero entre 1 y 100/
    );
  });

  test("GET /api/mocks/users rechaza qty mayor a 100", async () => {
    const response = await request(app)
      .get("/api/mocks/users?qty=101");

    expect(response.status).toBe(400);
  });

});

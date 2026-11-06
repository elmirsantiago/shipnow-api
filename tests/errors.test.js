
import request from "supertest";
import app from "../src/app.js";

describe("ShipNow API - Manejo global de errores", () => {

  test("Debe devolver 404 para una ruta inexistente", async () => {
    const response = await request(app)
      .get("/api/ruta-inexistente");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      code: "ROUTE_NOT_FOUND",
      message: "Ruta no encontrada"
    });
  });

  test("Debe rechazar un ID de usuario inválido", async () => {
    const response = await request(app)
      .get("/api/users/123");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: "INVALID_DATA",
      message: "El ID del usuario no es válido"
    });
  });

  test("Debe rechazar un ID de producto inválido", async () => {
    const response = await request(app)
      .get("/api/products/123");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_DATA");
  });

  test("Debe rechazar un ID de pedido inválido", async () => {
    const response = await request(app)
      .get("/api/orders/123");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_DATA");
  });

  test("Debe rechazar un estado de pedido inválido", async () => {
    const response = await request(app)
      .put("/api/orders/507f1f77bcf86cd799439011/status")
      .send({
        status: "volando"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: "INVALID_ORDER_STATUS",
      message: "Estado de pedido inválido"
    });
  });

  test("Debe rechazar un precio negativo", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        name: "Auriculares",
        description: "Bluetooth",
        price: -500,
        stock: 10,
        category: "Electrónica"
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_DATA");
    expect(response.body.message).toBe("Precio inválido");
  });

  test("Debe rechazar una cantidad inválida de mocks", async () => {
    const response = await request(app)
      .get("/api/mocks/users?qty=-5");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_MOCK_QUANTITY");
  });

  test("Debe rechazar un JSON mal formado", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .send('{"name": "Producto", "price":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      code: "INVALID_DATA",
      message: "El cuerpo de la petición contiene un JSON inválido"
    });
  });

});

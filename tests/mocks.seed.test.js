import {
  jest,
  describe,
  test,
  expect,
  beforeEach
} from "@jest/globals";

// Simulamos el Repository para no utilizar
// una base de datos MongoDB real.
jest.unstable_mockModule(
  "../src/repositories/mocks.repository.js",
  () => ({
    default: {
      getActiveStores: jest.fn(),
      createUsers: jest.fn(),
      createOrders: jest.fn(),
      createDeliveries: jest.fn()
    }
  })
);

const { default: mocksRepository } = await import(
  "../src/repositories/mocks.repository.js"
);

const { default: mocksService } = await import(
  "../src/services/mocks.service.js"
);

describe("ShipNow API - Seed de datos", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Simulamos una tienda activa existente.
    mocksRepository.getActiveStores.mockResolvedValue([
      {
        _id: "507f1f77bcf86cd799439011",
        name: "Tienda de prueba",
        isActive: true
      }
    ]);

    // Simulamos que MongoDB devuelve
    // los documentos con sus IDs.
    mocksRepository.createUsers.mockImplementation(
      async (users) =>
        users.map((user, index) => ({
          ...user,
          _id: `507f1f77bcf86cd799439${String(
            index + 100
          ).padStart(3, "0")}`
        }))
    );

    mocksRepository.createOrders.mockImplementation(
      async (orders) =>
        orders.map((order, index) => ({
          ...order,
          _id: `507f1f77bcf86cd799439${String(
            index + 200
          ).padStart(3, "0")}`
        }))
    );

    mocksRepository.createDeliveries.mockImplementation(
      async (deliveries) => deliveries
    );
  });

  test("Inserta las cantidades correctas de registros", async () => {
    const result = await mocksService.seed(2);

    expect(result.inserted).toEqual({
      users: 2,
      couriers: 2,
      orders: 2,
      deliveries: 2
    });

    expect(mocksRepository.createUsers)
      .toHaveBeenCalledTimes(2);

    expect(mocksRepository.createOrders)
      .toHaveBeenCalledTimes(1);

    expect(mocksRepository.createDeliveries)
      .toHaveBeenCalledTimes(1);
  });

  test("Rechaza el seed cuando no hay tiendas activas", async () => {
    mocksRepository.getActiveStores.mockResolvedValue([]);

    await expect(
      mocksService.seed(2)
    ).rejects.toThrow(
      "Necesitás al menos una tienda activa para generar pedidos"
    );

    expect(mocksRepository.createUsers)
      .not.toHaveBeenCalled();

    expect(mocksRepository.createOrders)
      .not.toHaveBeenCalled();

    expect(mocksRepository.createDeliveries)
      .not.toHaveBeenCalled();
  });

  test("Relaciona entregas con pedidos y repartidores", async () => {
    await mocksService.seed(2);

    const createdOrders =
      mocksRepository.createOrders.mock.results[0].value;

    const createdDeliveries =
      mocksRepository.createDeliveries.mock.calls[0][0];

    const orders = await createdOrders;

    const orderIds = orders.map((order) => order._id);

    expect(createdDeliveries).toHaveLength(2);

    createdDeliveries.forEach((delivery) => {
      expect(orderIds).toContain(delivery.order);

      expect(delivery.courier).toBeTruthy();

      expect(delivery.status).toBe("assigned");
    });
  });

});

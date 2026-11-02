
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import mocksRepository from "../repositories/mocks.repository.js";

import {
  generateMockUsers,
  generateMockCouriers,
  generateMockOrders,
  generateMockDeliveries
} from "../utils/mocks.generator.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

class MocksService {
  validateQty(value) {
    const qty = Number(value ?? 10);

    if (
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 100
    ) {
      throw createError(
        "qty debe ser un número entero entre 1 y 100"
      );
    }

    return qty;
  }

  async getMockUsers(qty) {
    return generateMockUsers(this.validateQty(qty));
  }

  async getMockCouriers(qty) {
    return generateMockCouriers(this.validateQty(qty));
  }

  async getMockOrders(qty) {
    const quantity = this.validateQty(qty);

    const customers = Array.from(
      { length: quantity },
      () => ({
        _id: faker.database.mongodbObjectId()
      })
    );

    const stores = Array.from(
      { length: quantity },
      () => ({
        _id: faker.database.mongodbObjectId()
      })
    );

    return generateMockOrders(
      quantity,
      customers,
      stores
    );
  }

  async getMockDeliveries(qty) {
    const quantity = this.validateQty(qty);

    const orders = Array.from(
      { length: quantity },
      () => ({
        _id: faker.database.mongodbObjectId()
      })
    );

    const couriers = Array.from(
      { length: quantity },
      () => ({
        _id: faker.database.mongodbObjectId()
      })
    );

    return generateMockDeliveries(
      quantity,
      orders,
      couriers
    );
  }

  async seed(qty) {
    const quantity = this.validateQty(qty);

    const stores =
      await mocksRepository.getActiveStores();

    if (stores.length === 0) {
      throw createError(
        "Necesitás al menos una tienda activa para generar pedidos"
      );
    }

    const passwordHash = await bcrypt.hash(
      faker.internet.password(),
      10
    );

    const customers = generateMockUsers(quantity)
      .map((user) => ({
        ...user,
        email: `${faker.string.uuid()}@test.com`,
        password: passwordHash
      }));

    const couriers = generateMockCouriers(quantity)
      .map((courier) => ({
        ...courier,
        email: `${faker.string.uuid()}@test.com`,
        password: passwordHash
      }));

    const createdCustomers =
      await mocksRepository.createUsers(customers);

    const createdCouriers =
      await mocksRepository.createUsers(couriers);

    const orders = generateMockOrders(
      quantity,
      createdCustomers,
      stores
    );

    const createdOrders =
      await mocksRepository.createOrders(orders);

    const deliveries = generateMockDeliveries(
      quantity,
      createdOrders,
      createdCouriers
    );

    const createdDeliveries =
      await mocksRepository.createDeliveries(deliveries);

    return {
      message: "Datos de prueba insertados correctamente",
      inserted: {
        users: createdCustomers.length,
        couriers: createdCouriers.length,
        orders: createdOrders.length,
        deliveries: createdDeliveries.length
      }
    };
  }
}

export default new MocksService();

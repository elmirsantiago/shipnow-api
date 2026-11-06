
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import mocksRepository from "../repositories/mocks.repository.js";
import AppError from "../errors/AppError.js";

import {
  generateMockUsers,
  generateMockCouriers,
  generateMockOrders,
  generateMockDeliveries
} from "../utils/mocks.generator.js";

class MocksService {
  validateQty(value) {
    const qty = Number(value ?? 10);

    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      throw new AppError("INVALID_MOCK_QUANTITY");
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
      () => ({ _id: faker.database.mongodbObjectId() })
    );

    const stores = Array.from(
      { length: quantity },
      () => ({ _id: faker.database.mongodbObjectId() })
    );

    return generateMockOrders(quantity, customers, stores);
  }

  async getMockDeliveries(qty) {
    const quantity = this.validateQty(qty);

    const orders = Array.from(
      { length: quantity },
      () => ({ _id: faker.database.mongodbObjectId() })
    );

    const couriers = Array.from(
      { length: quantity },
      () => ({ _id: faker.database.mongodbObjectId() })
    );

    return generateMockDeliveries(quantity, orders, couriers);
  }

  async seed(qty) {
    const quantity = this.validateQty(qty);

    try {
      const stores = await mocksRepository.getActiveStores();

      if (stores.length === 0) {
        throw new AppError("NO_ACTIVE_STORES");
      }

      const passwordHash = await bcrypt.hash(
        faker.internet.password(),
        10
      );

      const customers = generateMockUsers(quantity).map(user => ({
        ...user,
        email: `${faker.string.uuid()}@test.com`,
        password: passwordHash
      }));

      const couriers = generateMockCouriers(quantity).map(courier => ({
        ...courier,
        email: `${faker.string.uuid()}@test.com`,
        password: passwordHash
      }));

      const createdCustomers = await mocksRepository.createUsers(customers);
      const createdCouriers = await mocksRepository.createUsers(couriers);

      const orders = generateMockOrders(
        quantity,
        createdCustomers,
        stores
      );

      const createdOrders = await mocksRepository.createOrders(orders);

      const deliveries = generateMockDeliveries(
        quantity,
        createdOrders,
        createdCouriers
      );

      const createdDeliveries = await mocksRepository.createDeliveries(
        deliveries
      );

      return {
        message: "Datos de prueba insertados correctamente",
        inserted: {
          users: createdCustomers.length,
          couriers: createdCouriers.length,
          orders: createdOrders.length,
          deliveries: createdDeliveries.length
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Error al insertar datos de prueba:", error);

      throw new AppError("DATABASE_ERROR");
    }
  }
}

export default new MocksService();

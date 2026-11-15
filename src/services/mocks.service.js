
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import mocksRepository from "../repositories/mocks.repository.js";
import AppError from "../errors/AppError.js";
import logger from "../config/logger.js";

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
      logger.warning(
        `Cantidad inválida solicitada para mocks: ${String(value)}`
      );

      throw new AppError("INVALID_MOCK_QUANTITY");
    }

    return qty;
  }

  async getMockUsers(qty) {
    const quantity = this.validateQty(qty);

    const users = generateMockUsers(quantity);

    logger.info(
      `Se generaron ${quantity} usuarios mock correctamente`
    );

    return users;
  }

  async getMockCouriers(qty) {
    const quantity = this.validateQty(qty);

    const couriers = generateMockCouriers(quantity);

    logger.info(
      `Se generaron ${quantity} repartidores mock correctamente`
    );

    return couriers;
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

    const orders = generateMockOrders(
      quantity,
      customers,
      stores
    );

    logger.info(
      `Se generaron ${quantity} pedidos mock correctamente`
    );

    return orders;
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

    const deliveries = generateMockDeliveries(
      quantity,
      orders,
      couriers
    );

    logger.info(
      `Se generaron ${quantity} entregas mock correctamente`
    );

    return deliveries;
  }

  async seed(qty) {
    const quantity = this.validateQty(qty);

    logger.info(
      `Iniciando inserción de datos mock: ${quantity} registros por entidad`
    );

    try {
      const stores = await mocksRepository.getActiveStores();

      if (stores.length === 0) {
        logger.warning(
          "No hay tiendas activas disponibles para generar datos mock"
        );

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

      const createdCustomers = await mocksRepository.createUsers(
        customers
      );

      const createdCouriers = await mocksRepository.createUsers(
        couriers
      );

      const orders = generateMockOrders(
        quantity,
        createdCustomers,
        stores
      );

      const createdOrders = await mocksRepository.createOrders(
        orders
      );

      const deliveries = generateMockDeliveries(
        quantity,
        createdOrders,
        createdCouriers
      );

      const createdDeliveries =
        await mocksRepository.createDeliveries(deliveries);

      logger.info(
        `Datos mock insertados correctamente: ` +
        `${createdCustomers.length} usuarios, ` +
        `${createdCouriers.length} repartidores, ` +
        `${createdOrders.length} pedidos y ` +
        `${createdDeliveries.length} entregas`
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

      logger.error(
        `Error al insertar datos de prueba: ${error.stack || error.message}`
      );

      throw new AppError("DATABASE_ERROR");
    }
  }
}

export default new MocksService();

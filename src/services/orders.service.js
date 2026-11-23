
import mongoose from "mongoose";

import ordersRepository from "../repositories/orders.repository.js";
import usersRepository from "../repositories/users.repository.js";
import storesRepository from "../repositories/stores.repository.js";

import { ORDER_STATUS, ORDER_PRIORITY } from "../utils/constants.js";
import AppError from "../errors/AppError.js";
import logger from "../config/logger.js";

class OrdersService {
  validateId(id, field = "pedido") {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(
        "INVALID_DATA",
        `El ID del ${field} no es válido`
      );
    }
  }

  async getAllOrders({
    page = 1,
    limit = 10,
    status,
    priority
  } = {}) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isSafeInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      throw new AppError(
        "INVALID_DATA",
        "La página debe ser mayor a 0 y el límite debe estar entre 1 y 100"
      );
    }

    if (
      status !== undefined &&
      !Object.values(ORDER_STATUS).includes(status)
    ) {
      throw new AppError(
        "INVALID_DATA",
        "El estado utilizado para filtrar pedidos no es válido"
      );
    }

    if (
      priority !== undefined &&
      !Object.values(ORDER_PRIORITY).includes(priority)
    ) {
      throw new AppError(
        "INVALID_DATA",
        "La prioridad utilizada para filtrar pedidos no es válida"
      );
    }

    return ordersRepository.getAll({
      page: pageNumber,
      limit: limitNumber,
      status,
      priority
    });
  }

  async getOrderById(id) {
    this.validateId(id);

    const order = await ordersRepository.getById(id);

    if (!order) {
      logger.warning(
        `Intento de consultar un pedido inexistente: ${id}`
      );

      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }

  async createOrder(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

    const {
      customer,
      store,
      items,
      deliveryAddress,
      priority
    } = data;

    if (
      !customer ||
      !store ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Faltan datos obligatorios"
      );
    }

    this.validateId(customer, "cliente");
    this.validateId(store, "comercio");

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError(
        "INVALID_DATA",
        "El pedido debe tener al menos un producto"
      );
    }

    for (const item of items) {
      if (
        !item ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        typeof item.price !== "number" ||
        !Number.isFinite(item.price) ||
        item.price < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new AppError(
          "INVALID_DATA",
          "Cada producto debe tener nombre, precio válido y cantidad positiva"
        );
      }
    }

    if (
      priority !== undefined &&
      !Object.values(ORDER_PRIORITY).includes(priority)
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Prioridad de pedido inválida"
      );
    }

    const customerFound = await usersRepository.getById(customer);

    if (!customerFound) {
      throw new AppError("USER_NOT_FOUND");
    }

    const storeFound = await storesRepository.getById(store);

    if (!storeFound) {
      throw new AppError("STORE_NOT_FOUND");
    }

    if (!storeFound.isActive) {
      throw new AppError(
        "INVALID_DATA",
        "El comercio no está activo"
      );
    }

    const total = items.reduce(
      (accumulator, item) =>
        accumulator + item.price * item.quantity,
      0
    );

    const order = await ordersRepository.create({
      customer,
      store,
      items,
      deliveryAddress: deliveryAddress.trim(),
      priority,
      total,
      status: ORDER_STATUS.CREATED
    });

    logger.info(
      `Pedido creado correctamente: ${order._id}`
    );

    return order;
  }

  async updateOrderStatus(id, status) {
    this.validateId(id);

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new AppError("INVALID_ORDER_STATUS");
    }

    const order = await ordersRepository.updateStatus(id, status);

    if (!order) {
      logger.warning(
        `Intento de actualizar un pedido inexistente: ${id}`
      );

      throw new AppError("ORDER_NOT_FOUND");
    }

    logger.info(
      `Estado del pedido ${id} actualizado a: ${status}`
    );

    return order;
  }

  async deleteOrder(id) {
    this.validateId(id);

    const order = await ordersRepository.delete(id);

    if (!order) {
      logger.warning(
        `Intento de eliminar un pedido inexistente: ${id}`
      );

      throw new AppError("ORDER_NOT_FOUND");
    }

    logger.info(
      `Pedido eliminado correctamente: ${id}`
    );

    return order;
  }
}

export default new OrdersService();

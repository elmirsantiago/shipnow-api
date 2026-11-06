
import mongoose from "mongoose";

import ordersRepository from "../repositories/orders.repository.js";
import usersRepository from "../repositories/users.repository.js";
import storesRepository from "../repositories/stores.repository.js";

import { ORDER_STATUS, ORDER_PRIORITY } from "../utils/constants.js";
import AppError from "../errors/AppError.js";

class OrdersService {
  validateId(id, field = "pedido") {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(
        "INVALID_DATA",
        `El ID del ${field} no es válido`
      );
    }
  }

  async getAllOrders() {
    return ordersRepository.getAll();
  }

  async getOrderById(id) {
    this.validateId(id);

    const order = await ordersRepository.getById(id);

    if (!order) {
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

    return ordersRepository.create({
      customer,
      store,
      items,
      deliveryAddress: deliveryAddress.trim(),
      priority,
      total,
      status: ORDER_STATUS.CREATED
    });
  }

  async updateOrderStatus(id, status) {
    this.validateId(id);

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new AppError("INVALID_ORDER_STATUS");
    }

    const order = await ordersRepository.updateStatus(id, status);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }

  async deleteOrder(id) {
    this.validateId(id);

    const order = await ordersRepository.delete(id);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }
}

export default new OrdersService();

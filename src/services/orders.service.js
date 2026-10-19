
import ordersRepository from "../repositories/orders.repository.js";
import usersRepository from "../repositories/users.repository.js";
import storesRepository from "../repositories/stores.repository.js";
import { ORDER_STATUS } from "../utils/constants.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

class OrdersService {
  async getAllOrders() {
    return ordersRepository.getAll();
  }

  async getOrderById(id) {
    const order = await ordersRepository.getById(id);

    if (!order) {
      throw createError("Pedido no encontrado", 404);
    }

    return order;
  }

  async createOrder(data) {
    const { customer, store, items, deliveryAddress, priority } = data;

    if (!customer || !store || !deliveryAddress) {
      throw createError("Faltan datos obligatorios", 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw createError(
        "El pedido debe tener al menos un producto",
        400
      );
    }

    for (const item of items) {
      if (
        !item.name ||
        !Number.isFinite(item.price) ||
        item.price < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw createError(
          "Cada producto debe tener nombre, precio válido y cantidad positiva",
          400
        );
      }
    }

    const customerFound = await usersRepository.getById(customer);

    if (!customerFound) {
      throw createError("Usuario no encontrado", 404);
    }

    const storeFound = await storesRepository.getById(store);

    if (!storeFound) {
      throw createError("Comercio no encontrado", 404);
    }

    if (!storeFound.isActive) {
      throw createError("El comercio no está activo", 400);
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
      deliveryAddress,
      priority,
      total,
      status: ORDER_STATUS.CREATED
    });
  }

  async updateOrderStatus(id, status) {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw createError("Estado de pedido inválido", 400);
    }

    const order = await ordersRepository.updateStatus(id, status);

    if (!order) {
      throw createError("Pedido no encontrado", 404);
    }

    return order;
  }

  async deleteOrder(id) {
    const order = await ordersRepository.delete(id);

    if (!order) {
      throw createError("Pedido no encontrado", 404);
    }

    return order;
  }
}

export default new OrdersService();


import { faker } from "@faker-js/faker";

import {
  USER_ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS
} from "./constants.js";

const randomValue = (values) =>
  faker.helpers.arrayElement(values);

const createPerson = (role) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  role
});

// Generar clientes ficticios
export const generateMockUsers = (qty = 10) =>
  Array.from({ length: qty }, () =>
    createPerson(USER_ROLES.USER)
  );

// Generar repartidores ficticios
export const generateMockCouriers = (qty = 10) =>
  Array.from({ length: qty }, () =>
    createPerson(USER_ROLES.COURIER)
  );

// Generar pedidos ficticios
export const generateMockOrders = (
  qty = 10,
  customers = [],
  stores = []
) =>
  Array.from({ length: qty }, () => {
    const quantity = faker.number.int({
      min: 1,
      max: 5
    });

    const price = faker.number.int({
      min: 1000,
      max: 20000
    });

    return {
      customer: customers.length
        ? randomValue(customers)._id
        : null,

      store: stores.length
        ? randomValue(stores)._id
        : null,

      items: [
        {
          name: faker.commerce.productName(),
          quantity,
          price
        }
      ],

      deliveryAddress:
        faker.location.streetAddress(),

      total: quantity * price,

      // Coherente con la entrega asignada
      status: ORDER_STATUS.ASSIGNED,

      priority: randomValue(
        Object.values(ORDER_PRIORITY)
      ),

      proof: null
    };
  });

// Generar entregas ficticias
export const generateMockDeliveries = (
  qty = 10,
  orders = [],
  couriers = []
) => {
  const selectedOrders = faker.helpers.arrayElements(
    orders,
    Math.min(qty, orders.length)
  );

  return selectedOrders.map((order) => {
    const courier = couriers.length
      ? randomValue(couriers)
      : null;

    return {
      order: order._id,

      courier: courier?._id ?? null,

      status: courier
        ? DELIVERY_STATUS.ASSIGNED
        : DELIVERY_STATUS.PENDING,

      assignedAt: courier ? new Date() : null,

      deliveredAt: null
    };
  });
};


export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "customer",
  STORE: "store"
});

export const ORDER_STATUS = Object.freeze({
  CREATED: "created",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock"
});

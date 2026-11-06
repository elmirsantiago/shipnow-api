
export const ERROR_DICTIONARY = Object.freeze({
  INVALID_DATA: {
    code: "INVALID_DATA",
    statusCode: 400,
    message: "Los datos proporcionados no son válidos"
  },

  INVALID_MOCK_QUANTITY: {
    code: "INVALID_MOCK_QUANTITY",
    statusCode: 400,
    message: "qty debe ser un número entero entre 1 y 100"
  },

  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    statusCode: 404,
    message: "Usuario no encontrado"
  },

  STORE_NOT_FOUND: {
    code: "STORE_NOT_FOUND",
    statusCode: 404,
    message: "Comercio no encontrado"
  },

  PRODUCT_NOT_FOUND: {
    code: "PRODUCT_NOT_FOUND",
    statusCode: 404,
    message: "Producto no encontrado"
  },

  ORDER_NOT_FOUND: {
    code: "ORDER_NOT_FOUND",
    statusCode: 404,
    message: "Pedido no encontrado"
  },

  INVALID_ORDER_STATUS: {
    code: "INVALID_ORDER_STATUS",
    statusCode: 400,
    message: "Estado de pedido inválido"
  },

  NO_ACTIVE_STORES: {
    code: "NO_ACTIVE_STORES",
    statusCode: 400,
    message: "Necesitás al menos una tienda activa para generar pedidos"
  },

  DUPLICATE_DATA: {
    code: "DUPLICATE_DATA",
    statusCode: 409,
    message: "Ya existe un registro con esos datos"
  },

  DATABASE_ERROR: {
    code: "DATABASE_ERROR",
    statusCode: 500,
    message: "Error al realizar una operación en la base de datos"
  },

  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    statusCode: 404,
    message: "Ruta no encontrada"
  },

  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    statusCode: 500,
    message: "Ocurrió un error interno en el servidor"
  }
});

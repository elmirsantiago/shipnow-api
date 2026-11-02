
import productsRepository from "../repositories/products.repository.js";
import { PRODUCT_STATUS } from "../utils/constants.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

class ProductsService {
  async getAllProducts() {
    return productsRepository.getAll();
  }

  async getProductById(id) {
    const product = await productsRepository.getById(id);

    if (!product) {
      throw createError("Producto no encontrado", 404);
    }

    return product;
  }

  async createProduct(data) {
    const { name, description, price, stock, category } = data;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      throw createError("Nombre y categoría son obligatorios", 400);
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw createError("Precio inválido", 400);
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw createError("Stock inválido", 400);
    }

    const status =
      stock > 0
        ? PRODUCT_STATUS.AVAILABLE
        : PRODUCT_STATUS.OUT_OF_STOCK;

    return productsRepository.create({
      name: name.trim(),
      description: description || "",
      price,
      stock,
      category: category.trim(),
      status
    });
  }

  async updateProduct(id, data) {
    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "category"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      throw createError(
        "No se enviaron campos válidos para actualizar",
        400
      );
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      throw createError("Nombre inválido", 400);
    }

    if (
      updates.category !== undefined &&
      (typeof updates.category !== "string" ||
        !updates.category.trim())
    ) {
      throw createError("Categoría inválida", 400);
    }

    if (
      updates.price !== undefined &&
      (typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0)
    ) {
      throw createError("Precio inválido", 400);
    }

    if (
      updates.stock !== undefined &&
      (!Number.isInteger(updates.stock) || updates.stock < 0)
    ) {
      throw createError("Stock inválido", 400);
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.category !== undefined) {
      updates.category = updates.category.trim();
    }

    if (updates.stock !== undefined) {
      updates.status =
        updates.stock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    const product = await productsRepository.update(id, updates);

    if (!product) {
      throw createError("Producto no encontrado", 404);
    }

    return product;
  }

  async deleteProduct(id) {
    const product = await productsRepository.delete(id);

    if (!product) {
      throw createError("Producto no encontrado", 404);
    }

    return product;
  }
}

export default new ProductsService();

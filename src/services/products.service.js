
import mongoose from "mongoose";

import productsRepository from "../repositories/products.repository.js";
import { PRODUCT_STATUS } from "../utils/constants.js";
import AppError from "../errors/AppError.js";

class ProductsService {
  validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(
        "INVALID_DATA",
        "El ID del producto no es válido"
      );
    }
  }

  async getAllProducts() {
    return productsRepository.getAll();
  }

  async getProductById(id) {
    this.validateId(id);

    const product = await productsRepository.getById(id);

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async createProduct(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

    const { name, description, price, stock, category } = data;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Nombre y categoría son obligatorios"
      );
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new AppError("INVALID_DATA", "Precio inválido");
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new AppError("INVALID_DATA", "Stock inválido");
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      throw new AppError(
        "INVALID_DATA",
        "La descripción debe ser un texto"
      );
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
    this.validateId(id);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

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
      throw new AppError(
        "INVALID_DATA",
        "No se enviaron campos válidos para actualizar"
      );
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      throw new AppError("INVALID_DATA", "Nombre inválido");
    }

    if (
      updates.category !== undefined &&
      (
        typeof updates.category !== "string" ||
        !updates.category.trim()
      )
    ) {
      throw new AppError("INVALID_DATA", "Categoría inválida");
    }

    if (
      updates.description !== undefined &&
      typeof updates.description !== "string"
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Descripción inválida"
      );
    }

    if (
      updates.price !== undefined &&
      (
        typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0
      )
    ) {
      throw new AppError("INVALID_DATA", "Precio inválido");
    }

    if (
      updates.stock !== undefined &&
      (!Number.isInteger(updates.stock) || updates.stock < 0)
    ) {
      throw new AppError("INVALID_DATA", "Stock inválido");
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
      throw new AppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async deleteProduct(id) {
    this.validateId(id);

    const product = await productsRepository.delete(id);

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }
}

export default new ProductsService();

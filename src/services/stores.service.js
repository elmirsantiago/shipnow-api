
import mongoose from "mongoose";

import storesRepository from "../repositories/stores.repository.js";
import usersRepository from "../repositories/users.repository.js";
import AppError from "../errors/AppError.js";

class StoresService {
  validateId(id, field = "comercio") {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(
        "INVALID_DATA",
        `El ID del ${field} no es válido`
      );
    }
  }

  async getAllStores() {
    return storesRepository.getAll();
  }

  async getStoreById(id) {
    this.validateId(id);

    const store = await storesRepository.getById(id);

    if (!store) {
      throw new AppError("STORE_NOT_FOUND");
    }

    return store;
  }

  async createStore(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

    const { name, address, owner } = data;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      !owner
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Nombre, dirección y propietario son obligatorios"
      );
    }

    this.validateId(owner, "propietario");

    const user = await usersRepository.getById(owner);

    if (!user) {
      throw new AppError(
        "USER_NOT_FOUND",
        "El propietario no existe"
      );
    }

    return storesRepository.create({
      name: name.trim(),
      address: address.trim(),
      owner
    });
  }

  async updateStore(id, data) {
    this.validateId(id);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

    const allowedFields = ["name", "address", "isActive"];
    const updates = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (field === "isActive") {
          if (typeof data[field] !== "boolean") {
            throw new AppError(
              "INVALID_DATA",
              "El campo isActive debe ser verdadero o falso"
            );
          }
        } else {
          if (
            typeof data[field] !== "string" ||
            !data[field].trim()
          ) {
            throw new AppError(
              "INVALID_DATA",
              `El campo ${field} debe ser un texto válido`
            );
          }
        }

        updates[field] =
          field === "isActive" ? data[field] : data[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError(
        "INVALID_DATA",
        "No se enviaron campos válidos para actualizar"
      );
    }

    const store = await storesRepository.update(id, updates);

    if (!store) {
      throw new AppError("STORE_NOT_FOUND");
    }

    return store;
  }

  async deleteStore(id) {
    this.validateId(id);

    const store = await storesRepository.delete(id);

    if (!store) {
      throw new AppError("STORE_NOT_FOUND");
    }

    return store;
  }
}

export default new StoresService();

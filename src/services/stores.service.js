
import storesRepository from "../repositories/stores.repository.js";
import usersRepository from "../repositories/users.repository.js";

class StoresService {
  async getAllStores() {
    return storesRepository.getAll();
  }

  async getStoreById(id) {
    const store = await storesRepository.getById(id);

    if (!store) {
      const error = new Error("Comercio no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return store;
  }

  async createStore(data) {
    const { name, address, owner } = data;

    if (!name || !address || !owner) {
      const error = new Error(
        "Nombre, dirección y propietario son obligatorios"
      );
      error.statusCode = 400;
      throw error;
    }

    const user = await usersRepository.getById(owner);

    if (!user) {
      const error = new Error("El propietario no existe");
      error.statusCode = 404;
      throw error;
    }

    return storesRepository.create({
      name,
      address,
      owner
    });
  }

  async updateStore(id, data) {
    const allowedFields = ["name", "address", "isActive"];
    const updates = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      const error = new Error(
        "No se enviaron campos válidos para actualizar"
      );
      error.statusCode = 400;
      throw error;
    }

    const store = await storesRepository.update(id, updates);

    if (!store) {
      const error = new Error("Comercio no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return store;
  }

  async deleteStore(id) {
    const store = await storesRepository.delete(id);

    if (!store) {
      const error = new Error("Comercio no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return store;
  }
}

export default new StoresService();

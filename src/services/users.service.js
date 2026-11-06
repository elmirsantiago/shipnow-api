
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import usersRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../utils/constants.js";
import AppError from "../errors/AppError.js";

class UsersService {
  validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("INVALID_DATA", "El ID del usuario no es válido");
    }
  }

  async getAllUsers() {
    return usersRepository.getAll();
  }

  async getUserById(id) {
    this.validateId(id);

    const user = await usersRepository.getById(id);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return user;
  }

  async createUser(data) {
    if (
      !data ||
      typeof data.firstName !== "string" ||
      !data.firstName.trim() ||
      typeof data.lastName !== "string" ||
      !data.lastName.trim() ||
      typeof data.email !== "string" ||
      !data.email.trim() ||
      typeof data.password !== "string" ||
      !data.password
    ) {
      throw new AppError(
        "INVALID_DATA",
        "Nombre, apellido, email y contraseña son obligatorios"
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: hashedPassword,
      role: USER_ROLES.USER
    };

    const user = await usersRepository.create(userData);

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  }

  async updateUser(id, data) {
    this.validateId(id);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("INVALID_DATA");
    }

    const allowedFields = ["firstName", "lastName"];
    const updates = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (
          typeof data[field] !== "string" ||
          !data[field].trim()
        ) {
          throw new AppError(
            "INVALID_DATA",
            `El campo ${field} debe ser un texto válido`
          );
        }

        updates[field] = data[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError(
        "INVALID_DATA",
        "No se enviaron campos válidos para actualizar"
      );
    }

    const user = await usersRepository.update(id, updates);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return user;
  }

  async deleteUser(id) {
    this.validateId(id);

    const user = await usersRepository.delete(id);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return user;
  }
}

export default new UsersService();

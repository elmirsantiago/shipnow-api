
import bcrypt from "bcrypt";
import usersRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../utils/constants.js";

class UsersService {
  async getAllUsers() {
    return usersRepository.getAll();
  }

  async getUserById(id) {
    const user = await usersRepository.getById(id);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: USER_ROLES.USER
    };

    const user = await usersRepository.create(userData);

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  }

  async updateUser(id, data) {
    const allowedFields = ["firstName", "lastName"];
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

    const user = await usersRepository.update(id, updates);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async deleteUser(id) {
    const user = await usersRepository.delete(id);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

export default new UsersService();

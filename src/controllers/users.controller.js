
import usersService from "../services/users.service.js";

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAllUsers();

      return res.json({
        status: "success",
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.uid);

      return res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await usersService.createUser(req.body);

      return res.status(201).json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await usersService.updateUser(
        req.params.uid,
        req.body
      );

      return res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await usersService.deleteUser(req.params.uid);

      return res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();

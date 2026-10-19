
import usersService from "../services/users.service.js";

class UsersController {
  async getAll(req, res) {
    try {
      const users = await usersService.getAllUsers();

      res.json({
        status: "success",
        payload: users
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const user = await usersService.getUserById(req.params.uid);

      res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const user = await usersService.createUser(req.body);

      res.status(201).json({
        status: "success",
        payload: user
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const user = await usersService.updateUser(
        req.params.uid,
        req.body
      );

      res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const user = await usersService.deleteUser(req.params.uid);

      res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new UsersController();

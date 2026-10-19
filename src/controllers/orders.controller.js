
import ordersService from "../services/orders.service.js";

class OrdersController {
  async getAll(req, res) {
    try {
      const orders = await ordersService.getAllOrders();

      res.json({
        status: "success",
        payload: orders
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
      const order = await ordersService.getOrderById(req.params.oid);

      res.json({
        status: "success",
        payload: order
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
      const order = await ordersService.createOrder(req.body);

      res.status(201).json({
        status: "success",
        payload: order
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const order = await ordersService.updateOrderStatus(
        req.params.oid,
        req.body.status
      );

      res.json({
        status: "success",
        payload: order
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
      const order = await ordersService.deleteOrder(req.params.oid);

      res.json({
        status: "success",
        payload: order
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new OrdersController();

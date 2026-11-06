
import ordersService from "../services/orders.service.js";

class OrdersController {
  async getAll(req, res, next) {
    try {
      const orders = await ordersService.getAllOrders();

      return res.json({
        status: "success",
        payload: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await ordersService.getOrderById(req.params.oid);

      return res.json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await ordersService.createOrder(req.body);

      return res.status(201).json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const order = await ordersService.updateOrderStatus(
        req.params.oid,
        req.body?.status
      );

      return res.json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const order = await ordersService.deleteOrder(req.params.oid);

      return res.json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdersController();

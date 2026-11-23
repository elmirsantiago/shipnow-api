

import ordersService from "../services/orders.service.js";

class OrdersController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority
      } = req.query;

      const result = await ordersService.getAllOrders({
        page,
        limit,
        status,
        priority
      });

      return res.status(200).json({
        status: "success",
        payload: result.orders,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await ordersService.getOrderById(req.params.oid);

      return res.status(200).json({
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

      return res.status(200).json({
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

      return res.status(200).json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdersController();

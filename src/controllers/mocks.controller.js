
import mocksService from "../services/mocks.service.js";

class MocksController {
  handleError(res, error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    });
  }

  async getUsers(req, res) {
    try {
      const users = await mocksService.getMockUsers(req.query.qty);
      return res.status(200).json(users);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getCouriers(req, res) {
    try {
      const couriers = await mocksService.getMockCouriers(req.query.qty);
      return res.status(200).json(couriers);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await mocksService.getMockOrders(req.query.qty);
      return res.status(200).json(orders);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getDeliveries(req, res) {
    try {
      const deliveries = await mocksService.getMockDeliveries(req.query.qty);
      return res.status(200).json(deliveries);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async seed(req, res) {
    try {
      const result = await mocksService.seed(req.query.qty);
      return res.status(201).json(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new MocksController();

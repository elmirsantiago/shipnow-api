
import mocksService from "../services/mocks.service.js";

class MocksController {
  async getMockUsers(req, res, next) {
    try {
      const users = await mocksService.getMockUsers(req.query.qty);
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getMockCouriers(req, res, next) {
    try {
      const couriers = await mocksService.getMockCouriers(req.query.qty);
      return res.status(200).json(couriers);
    } catch (error) {
      next(error);
    }
  }

  async getMockOrders(req, res, next) {
    try {
      const orders = await mocksService.getMockOrders(req.query.qty);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getMockDeliveries(req, res, next) {
    try {
      const deliveries = await mocksService.getMockDeliveries(req.query.qty);
      return res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  async seed(req, res, next) {
    try {
      const result = await mocksService.seed(req.query.qty);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new MocksController();


import storesService from "../services/stores.service.js";

class StoresController {
  async getAll(req, res, next) {
    try {
      const stores = await storesService.getAllStores();

      return res.json({
        status: "success",
        payload: stores
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const store = await storesService.getStoreById(req.params.sid);

      return res.json({
        status: "success",
        payload: store
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const store = await storesService.createStore(req.body);

      return res.status(201).json({
        status: "success",
        payload: store
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const store = await storesService.updateStore(
        req.params.sid,
        req.body
      );

      return res.json({
        status: "success",
        payload: store
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const store = await storesService.deleteStore(req.params.sid);

      return res.json({
        status: "success",
        payload: store
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StoresController();

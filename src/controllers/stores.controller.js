
import storesService from "../services/stores.service.js";

class StoresController {
  async getAll(req, res) {
    try {
      const stores = await storesService.getAllStores();

      res.json({
        status: "success",
        payload: stores
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
      const store = await storesService.getStoreById(req.params.sid);

      res.json({
        status: "success",
        payload: store
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
      const store = await storesService.createStore(req.body);

      res.status(201).json({
        status: "success",
        payload: store
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
      const store = await storesService.updateStore(
        req.params.sid,
        req.body
      );

      res.json({
        status: "success",
        payload: store
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
      const store = await storesService.deleteStore(req.params.sid);

      res.json({
        status: "success",
        payload: store
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new StoresController();

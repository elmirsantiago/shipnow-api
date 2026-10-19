
import productsService from "../services/products.service.js";

class ProductsController {
  async getAll(req, res) {
    try {
      const products = await productsService.getAllProducts();

      res.json({
        status: "success",
        payload: products
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
      const product = await productsService.getProductById(req.params.pid);

      res.json({
        status: "success",
        payload: product
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
      const product = await productsService.createProduct(req.body);

      res.status(201).json({
        status: "success",
        payload: product
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
      const product = await productsService.updateProduct(
        req.params.pid,
        req.body
      );

      res.json({
        status: "success",
        payload: product
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
      const product = await productsService.deleteProduct(req.params.pid);

      res.json({
        status: "success",
        payload: product
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new ProductsController();
